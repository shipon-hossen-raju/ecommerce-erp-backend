import { NextFunction, Request, RequestHandler, Response } from "express";

// Wrap an async route handler so thrown errors reach the global error handler
const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next)
        }
        catch (err) {
            next(err);
        }
    }
};

export default catchAsync;