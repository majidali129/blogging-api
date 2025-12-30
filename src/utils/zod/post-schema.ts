
import z from "zod";

export const newPostSchema = z.object({
    title: z.string().trim().min(8, 'Title must be 8 chars long'),
    description: z.string().min(1, 'Description is required'),
    summary: z.string().min(1, 'Post summary is mendatory'),
    tags: z.array(z.string(), 'Tags must be a string or list of strings').default([]).optional()
    ,readTime: z.string().transform(value => parseInt(value, 10))
})

export const updatePostSchema = z.object({
    title: z.string().trim().min(8, 'Title must be 8 chars long').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    summary: z.string().min(1, 'Post summary is mendatory').optional(),
    tags: z.array(z.string(), 'Tags must be a string or list of strings').optional(),
    readTime: z.string().transform(value => parseInt(value, 10)).optional()
})


