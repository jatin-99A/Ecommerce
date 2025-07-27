import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { controllerType } from "../types/types.js";

export const ErrorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default values
  let statusCode = 500;
  let message = err.message || "Internal server error!";

  if (err.name === "ValidationError") {
    statusCode = 400;
  } else if ((err.cause as any)?.code === 11000) {
    statusCode = 409;
    message = "Please use a unique value";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.name === "SyntaxError") {
    statusCode = 400;
    message = "Malformed JSON in request body";
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    statusCode = 401;
  } else if (err.statusCode && typeof err.statusCode === "number") {
    statusCode = err.statusCode;
    message = err.message || message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

// Async error handler
export const tryCatch =
  (controller: controllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
