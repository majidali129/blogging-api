import z from "zod";


export const newCommentSchema = z.object({
    content: z.string().trim().min(1, 'Content for comment is required'),
    postId: z.string().min(1, 'Post ID is required'),
    parentCommentId: z.string().optional()
})

export const updateCommentSchema = z.object({
    content: z.string().trim().min(1, 'Content for comment is required')
})
