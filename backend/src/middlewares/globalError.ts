import { NextFunction, Request, Response } from "express";
import config from "../config/env";
import logger from "../config/logger";

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
