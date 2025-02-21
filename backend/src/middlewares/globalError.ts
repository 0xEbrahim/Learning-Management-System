import { NextFunction, Request, Response } from "express";
import config from "../config/env";
import logger from "../config/logger";
import APIError from "../utils/APIError";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  logger.error("Route: " + req.originalUrl + " not found");
  res.status(404).json({
    status: "Error",
    message: "Route: " + req.originalUrl + " not found",
  });
};

export const ValidationErrorDB = (error: any): APIError => {
  let message = error.message;
  message = message.replace(
    /Argument `where` of type .* needs at least one of `(.*?)`/,
    "Missing required field: $1."
  );
  return new APIError(message, 400);
};

export const TokenExpiredError = (error: any): APIError => {
  const message: string = "Invalid or expired token, please login again.";
  return new APIError(message, 498);
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);
  if (err.name === "PrismaClientValidationError") err = ValidationErrorDB(err);
  if (err.name === "TokenExpiredError") err = TokenExpiredError(err);
  const response = {
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  };

  if (config.NODE_ENV === "production") {
    response.stack = undefined;
    response.err = undefined;
  }
  res.status(err.statusCode || 500).json(response);
};
