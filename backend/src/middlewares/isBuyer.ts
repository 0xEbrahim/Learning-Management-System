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
      include: {
        buyers: true,
      },
    });
    if (!course) return next(new APIError("Invalid course ID", 404));
    const isBuyer = course.buyers.some((el) => el.userId === req.User?.id);
    if (
      isBuyer ||
      req.User?.role === "ADMIN" ||
      course.publisherId === req.User?.id
    )
      next();
    else {
      return next(
        new APIError(
          "You are need to purchase the course to view the video",
          403
        )
      );
    }
  }
);
