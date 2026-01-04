import { prisma } from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { apiResponse } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";


export const followUser = asyncHandler(async (req, res) => {
    const {id: followingId} = req.params
    const followerId = req.user.userId;

    if (!followingId) throw new ApiError(400, 'Missing required parameter: followingId');
    
    if (followerId === followingId) throw new ApiError(400, 'You cannot follow yourself');

    const existingFollow = await prisma.follow.findFirst({
        where: {
                followerId,
                followingId
        }
    })

    if (existingFollow) throw new ApiError(400, 'You are already following this user');

    const follow = await prisma.follow.create({
        data: {
            followerId,
            followingId
        },
        select: {
            following: {
                select: {
                    id: true,
                    username: true,
                }
            }
        }
    })

    return apiResponse(res, 201, 'User followed successfully', follow)

})

export const unfollowUser = asyncHandler(async (req, res) => {
    const {id: followingId} = req.params
    const followerId = req.user.userId;

    if (!followingId) throw new ApiError(400, 'Missing required parameter: followingId');


    const deleted = await prisma.follow.delete({
        where: {
            followerId_followingId: {
                followerId,
                followingId
            }
        }
    })

    if (!deleted) throw new ApiError(404, 'You are not following this user');
return apiResponse(res, 200, 'User unfollowed successfully');
})
 
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
        where: {
            id: {
                not: {equals: req.user.userId}
            }
        },
        select: {
            id: true,
            username: true,
            fullName: true,
            profileImage: true,
            bio: true,
            createdAt: true, // to show ( joinedAt )
        }
    })

    return apiResponse(res, 200, 'All users fetched', {users})
})

export const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
             id: true,
            username: true,
            fullName: true,
            profileImage: true,
            bio: true,
            createdAt: true,
            socielLinks: true,
            isActive: true,
            _count: {
                select: {
                    posts: true,
                    series: true,
                    followers: true,
                    followings: true
                }
            }
        }
    });


    if (!user) throw new ApiError(404, 'User profile no longer exists');

    return apiResponse(res, 200, 'User profile fetched successfully', {
        user
    });
})

//TODO: PAGINATION ( CURSOR BASED )
export const getUserPosts = asyncHandler(async (req, res) => {
    const posts = await prisma.post.findMany({
        where: { authorId: req.params.id },
        select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            coverImage: true,
            _count: {
                select: {
                    bookmarks: true,
                    comments: true,
                    likes: true
                }
            }
        }
    });

    return apiResponse(res, 200, 'User posts fetched', {posts})
})

export const getUserFollowers = asyncHandler(async (req, res) => {
    const currentUserId = req.user.userId;
    const followers = await prisma.follow.findMany({
        where: {
            followingId: req.params.id
        },
        select: {
            id: true,
            follower: {
                select: {
                     id: true,
                    username: true,
                    fullName: true,
                    profileImage: true,
                    bio: true
                }
            }
        }
    });

    const currentUserFollowings = await prisma.follow.findMany({
        where: {followerId: currentUserId},
        select:{followingId: true}
    })

    const followingIds = new Set(currentUserFollowings.map(f => f.followingId));

    const followersWithFlag = followers.map(f => ({...f, isFollowing: followingIds.has(f.follower.id)}))

    return apiResponse(res, 200, 'Followers fetched successfully', { followers: followersWithFlag })
})

export const getUserFollowings = asyncHandler(async (req, res) => {
const followings = await prisma.follow.findMany({
        where: {
            followerId: req.params.id
        },
        include: {
            following: {
                select: {
                    id: true,
                    username: true,
                    fullName: true,
                    profileImage: true,
                    bio: true
                }
            }
    }
    })

    return apiResponse(res, 200, 'Followings fetched successfully', {followings: followings.map(f => f.following)})
})

export const getUserPostSeries = asyncHandler(async (req, res) => {
    const series = await prisma.series.findMany({
        where: { authorId: req.params.id },
        select: {
            id: true,
            title: true,
            description: true,
            coverImage: true,
            createdAt: true,
            _count: {
                select: {
                    posts: true
                }
            }
        }
    });
    return apiResponse(res, 200, 'User post series fetched successfully', {series})
})