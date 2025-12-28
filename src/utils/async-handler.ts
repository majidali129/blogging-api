import { NextFunction, Request, Response } from "express";



export const asyncHandler = (reqHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(reqHandler(req, res, next)).catch(err => next(err))
}
