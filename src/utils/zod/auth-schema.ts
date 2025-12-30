import z from "zod";


export const signUpInput = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(30, "Username must be at most 30 characters long").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 8 characters long").max(100, "Password must be at most 100 characters long"),
    fullName: z.string().min(1, "Full name is required").max(100, "Full name must be at most 100 characters long"),
})

export const signInInput = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 8 characters long").max(100, "Password must be at most 100 characters long"),
})

export const profileInput = z.object({
    profileImage: z.string().optional(),
    bio: z.string().max(500, "Bio must be at most 500 characters long").optional(),
    socialLinks: z.object({
        twitter: z.url("Invalid URL").optional(),
        github: z.url("Invalid URL").optional(),
        website: z.url("Invalid URL").optional(),
    }).optional(),
})

export const checkUsernameInput = z.object({
    username: z.string().min(1, 'Username is required')
})

export type SignUpInput = z.infer<typeof signUpInput>;
export type SignInInput = z.infer<typeof signInInput>;
export type ProfileInput = z.infer<typeof profileInput>;
export type CheckUsernameInput = z.infer<typeof checkUsernameInput>;
