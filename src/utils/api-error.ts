

export class ApiError extends Error {
    status: 'fail' | 'error';
    statusCode: number;
    isOperational: boolean;
    errors?: any
    constructor(statusCode: number, message: string, errors?: any) {
        super(message)
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor)
    }
}