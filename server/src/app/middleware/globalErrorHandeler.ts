import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import envVar from "../config/envVar";
import AppError from "../errorHelpers/appError";

const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    status: "error",
    message,
    error: err.message,
    err,
    stack: envVar.NODE_ENV === "development" ? err.stack : undefined,
  });
  next();
};

export default globalErrorHandler;
