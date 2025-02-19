import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import APIError from "../utils/APIError";
import { Roles } from "@prisma/client";
import { IRequest } from "../Interfaces/types";

export default (...roles: Array<Roles>) =>
  asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.User?.role as Roles) || "")
      return next(new APIError("You are not authorized to access that", 401));
    next();
  });
