
import { config } from '@/config';
import { ApiError } from '@/utils/api-error';
import { Prisma } from '@prisma/client';
import type { Request, Response, NextFunction } from 'express';
import { JWTExpired, JWTInvalid } from 'jose/errors';
import { MulterError } from 'multer';

const sendDevError = (err: ApiError, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
}
 
const sendProdError = (err: ApiError, res: Response) => { 
    if (err.isOperational) { 
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            errors: err.errors,
        });
    } else {
        
        console.error("ERROR 💥", err);
        res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }
}

const handlePrismaValidationError = (err: any) => {
    const message = `Invalid input data. ${err.message}`;
    return new ApiError(400, message);
}

const handleJwtError = (statusCode: number, message: string) => new ApiError(statusCode, message);

const handleMulterError = (err: MulterError) => {
    if(err.code === 'LIMIT_FILE_SIZE') {
        return new ApiError(400, 'File size is too large. Maximum limit is 2MB.');
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        return new ApiError(400, 'File limit reached. Maximum 1 file is allowed.');
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return new ApiError(400, 'Unexpected field name for the file upload. Use "profilePhoto" as the field name.');
    }


    return new ApiError(400, err.message)
}



export const globalErrorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Internal Server Error';

    if (config.NODE_ENV === 'development') {
        sendDevError(err, res);
    } else if (config.NODE_ENV === 'production') { 
        let error: ApiError = err;
        
        if (err instanceof ApiError) {
            // Handle JWT errors
            if (err.statusCode === 401) {
                error = handleJwtError(err.statusCode, err.message);
            }

           
        }

       
  if (err instanceof JWTInvalid) {
            error = handleJwtError(401, 'Invalid Token. Please login again');
        }

        if (err instanceof JWTExpired) {
            error = handleJwtError(401, 'Session Expired. Please login again');
        }
        if (err instanceof MulterError) {
            error = handleMulterError(err);
        }

        // Handle Prisma validation errors
        if (err instanceof Prisma.PrismaClientValidationError) {
            error = handlePrismaValidationError(err);
        }

       

        sendProdError(error, res);
    }
    }