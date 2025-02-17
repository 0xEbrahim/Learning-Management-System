import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
  });
};
