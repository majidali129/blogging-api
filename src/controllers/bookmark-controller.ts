import { prisma } from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { apiResponse } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";

// TODO: Params ID to MongoID validation

export const addPostToBookmark = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if(!postId) throw new ApiError(400, 'Missing required parameter: postId');

    const existingBookmark = await prisma.bookmark.findUnique({
        where: {postId, userId: req.user.userId}
    })

    if(existingBookmark) throw new ApiError(400, 'Post is already in reading list')
    
    await prisma.bookmark.create({
        data: {
            postId,
            userId: req.user.userId
        }
    })

    return apiResponse(res, 201, 'Post added to reading list')
})

export const removePostFromBookmark = asyncHandler(async (req, res) => {
    const { postId, id: bookmarkId } = req.params;

    if (!postId || !bookmarkId) throw new ApiError(400, 'Missing required parameters: postId and bookmarkId');

    const existingBookmark = await prisma.bookmark.findUnique({
        where: {
            id: bookmarkId,
            postId,
            userId: req.user.userId
        }
    })

    if (!existingBookmark) throw new ApiError(404, 'Bookmark no longer exists');

    await prisma.bookmark.delete({
        where: {
            id: bookmarkId,
            postId,
            userId: req.user.userId
        }
    })

    return apiResponse(res, 200, 'Post has been removed from reading list')
})
export const getAllUserBookmarks = asyncHandler(async (req, res) => {
    
    const bookmarks = await prisma.bookmark.findMany({
        where: {
            userId: req.user.userId,
        }
        , include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    status: true,
                    readTime: true,
                    updatedAt: true,
                    createdAt: true,
                    tags: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            profileImage: true
                        }
                    }
                }
            }
        }
    });

    return apiResponse(res, 200, 'User bookmarks fetched successfully', {bookmarks})
})
