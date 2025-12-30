import { isOwner } from "@/helpers/is-owner";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";
import { apiResponse } from "@/utils/api-response";
import { asyncHandler } from "@/utils/async-handler";
import { newCommentSchema, updateCommentSchema } from "@/utils/zod/comment-schema";



export const createComment = asyncHandler(async (req, res) => {
    const { postId, content } = newCommentSchema.parse(req.body);

    const post = await prisma.post.findUnique({
        where: { id: postId }
    });

    if (!post) throw new ApiError(404, 'Post no longer exists');

    const comment = await prisma.comment.create({
        data: {
            content,
            postId,
            authorId: req.user.userId,
            parentCommentId: null
        }
    });

    return apiResponse(res, 201, 'Comment created successfully', comment);

})
 
export const replyToComment = asyncHandler(async (req, res) => { 
    const { postId, content, parentCommentId } = newCommentSchema.parse(req.body);

    const post = await prisma.post.findUnique({
        where: { id: postId }
    });

    if (!post) throw new ApiError(404, 'Post no longer exists');

    const comment = await prisma.comment.create({
        data: {
            content,
            postId,
            parentCommentId,
            authorId: req.user.userId
        }, include: {
            author: {
                select: {
                    id: true,
                    username: true,
                    profileImage: true
                }
            },
            childComments: {
                include: {
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

    return apiResponse(res, 201, 'Comment created successfully', comment);
})

export const updateComment = asyncHandler(async (req, res) => { 
    const {content} = updateCommentSchema.parse(req.body);
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
        where: {id}
    });

    if (!comment) throw new ApiError(404, 'Comment not found');
    if(!isOwner(comment.authorId, req.user.userId)) throw new ApiError(403, 'You are not allowed to perform this action');

    const updatedComment = await prisma.comment.update({
        where: {id, authorId: req.user.userId},
        data: {content, updatedAt: new Date() }
    });

    return apiResponse(res, 200, 'Comment updated successfully', updatedComment);
})

export const deleteComment = asyncHandler(async (req, res) => { 
    const { id } = req.params;
    

    await prisma.$transaction(async (tx) => {

        const comment = await tx.comment.findUnique({
        where: { id }
        });
        
    if (!comment) throw new ApiError(404, 'Comment no longer exists');
    if (!isOwner(comment.authorId, req.user.userId)) throw new ApiError(403, 'You are not allowed to perform this action');

    // DELETE ALL CHILD COMMENTS
    await tx.comment.deleteMany({
        where: { parentCommentId: id }
    });

    await tx.comment.delete({
        where: { id }
    });
        
    })

    return apiResponse(res, 200, 'Comment deleted successfully');
    
 })

export const getPostComments = asyncHandler(async (req, res) => { 
    const postId = req.params.postId;
    
    // TODO: PAGINATION ( CURSOR BASED )
    const comments = await prisma.comment.findMany({
        where: {postId, parentCommentId: null },
        include: {
            author: {
                select: {
                    id: true,
                    username: true,
                    profileImage: true
                }
            },
            childComments: {
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            profileImage: true
                        }
                    },
                    childComments: {
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            profileImage: true
                        }
                            },
                    childComments: {
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            profileImage: true
                        }
                    }
                }
            }
                        },
                        
            }
                }
            }
        }
    });

    return apiResponse(res, 200, 'Comments fetched successfully', comments);
})

export const getCommentDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
                    username: true,
                    profileImage: true
                }
            },
            childComments: {
                select: {
                    id: true
                    , content: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            profileImage: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    childComments: true
                }
            }
        }
    })

    if (!comment) throw new ApiError(404, 'Comment not found');

    return apiResponse(res, 200, 'Comment details fetched successfully', comment);
})
