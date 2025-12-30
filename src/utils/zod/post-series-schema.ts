import z from "zod";




export const postSeriesSchema = z.object({
 title: z.string().min(8, 'Title must be 8 chars long'),
    description: z.string().min(1, 'Description is required'),
    tags: z.array(z.string(), 'Tags must be a string or list of strings').default([]),
    coverImage: z.file().optional()

})

export type NewSeriesType = z.infer<typeof postSeriesSchema>
export type UpdateSeriesType = Partial<NewSeriesType>