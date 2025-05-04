import { NextFunction, Response } from "express";
import { IRequest } from "../Interfaces/types";
import prisma from "../config/prisma";
import asyncHandler from "../utils/asyncHandler";
import APIError from "../utils/APIError";
import { isCourseAuthor } from "../utils/Functions/functions";

export default asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const userId = req.User?.id ?? "";
    const courseId = req.body.courseId;
    const check = await isCourseAuthor(courseId, userId);
    if (!check)
      return next(new APIError("You are not authorized on this course", 401));
    next();
  }
);
