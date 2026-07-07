import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { ZodError } from "zod";
import ApiError from "../../errors/ApiErrors";
import handleZodError from "../../errors/handleZodError";
import config from "../../config";

type TErrorSource = { path: string; message: string } | string;

// Central error handler: normalizes Zod/Mongoose/ApiError errors into a consistent response
const GlobalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong!";
  let errorSources: TErrorSource[] = [];

  console.error(`Global Error Handler: `, err);

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ type: "ApiError", details: err.message } as any];
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = `Invalid value for field '${err.path}'. Expected a valid id.`;
    errorSources.push("Mongoose Cast Error");
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    const validationErrors = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
    message = validationErrors[0]?.message || "Validation Error";
    errorSources = validationErrors;
  } else if (err.code === 11000) {
    statusCode = httpStatus.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0];
    message = field
      ? `${field} '${err.keyValue[field]}' already exists`
      : "Duplicate value error";
    errorSources.push("Duplicate Key Error");
  } else if (err instanceof SyntaxError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Syntax error in the request. Please verify your input.";
    errorSources.push("Syntax Error");
  } else {
    message = err.message || "An unexpected error occurred!";
    errorSources.push("Unknown Error");
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.isDev ? err?.stack : undefined,
  });
};

export default GlobalErrorHandler;
