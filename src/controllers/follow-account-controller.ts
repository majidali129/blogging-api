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

export const getCurrentUserFollowers = asyncHandler(async (req, res) => { 
    const followers = await prisma.follow.findMany({
        where: {
            followingId: req.user.userId
        },
            include: {
                follower: {
                    select: {id: true, username: true, profileImage: true}
                }
        }
    })


    return apiResponse(res, 200, 'Followers retrieved successfully', { followers: followers.map(f => f.follower)})
})

export const getCurrentUserFollowings = asyncHandler(async (req, res) => {
    const followings = await prisma.follow.findMany({
        where: {
            followerId: req.user.userId
        },
            include: {
                following: {
                    select: {id: true, username: true, profileImage: true}
                }
        }
    })

    return  apiResponse(res, 200, 'Followings retrieved successfully', {followings: followings.map(f => f.following)})
 })