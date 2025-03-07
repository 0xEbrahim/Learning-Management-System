import { NextFunction, Response } from "express";
import { IRequest } from "../Interfaces/types";
import prisma from "../config/prisma";
import asyncHandler from "../utils/asyncHandler";
import APIError from "../utils/APIError";

export default asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const course = await prisma.course.findUnique({
      where: {
        id: req.params.courseId,
      },
    });
    if (course?.publisherId === req.User?.id) next();
    else {
      return next(
        new APIError("You are not authorized to edit this course", 403)
      );
    }
  }
);
