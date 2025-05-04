import { NextFunction, Response } from "express";
import { IRequest } from "../Interfaces/types";
import asyncHandler from "../utils/asyncHandler";
import { isCourseBuyerOrAuthor } from "../utils/Functions/functions";
import APIError from "../utils/APIError";

export default asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const userId = req.User?.id ?? "";
    const courseId = req.body.courseId || req.params.courseId;
    const check = await isCourseBuyerOrAuthor(courseId, userId);
    if (!check)
      return next(new APIError("You are not authorized on this course", 401));
    next();
  }
);
