import { NextFunction, Request, Response } from "express";
import config from "../config/env";
import logger from "../config/logger";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  logger.error("Route: " + req.originalUrl + " not found");
  res.status(404).json({
    status: "Error",
    message: "Route: " + req.originalUrl + " not found",
  });
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);
  const response = {
    status: err.status,
    message: err.message,
    stack: err.stack,
  };
  if (config.NODE_ENV === "production") response.stack = undefined;
  res.status(err.statusCode || 500).json(response);
};
