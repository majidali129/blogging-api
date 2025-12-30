import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: +(process.env.PORT!) || 4000,
    DATABASE_URL: process.env.DATABASE_URL!,
    NODE_ENV: process.env.NODE_ENV || 'development',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [],
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '1d',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || '7d',

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL!,

    DEFAULT_RESPONSE_LIMIT: +(process.env.DEFAULT_RESPONSE_LIMIT!) || 20,
    DEFAULT_RESPONSE_OFFSET: +(process.env.DEFAULT_RESPONSE_OFFSET!) || 0,
}