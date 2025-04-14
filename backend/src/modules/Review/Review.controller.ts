import { NextFunction, Response } from "express";
import { IRequest, IResponse } from "../../Interfaces/types";
import asyncHandler from "../../utils/asyncHandler";
import { ICreateReviewBody } from "./Review.interface";
import ReviewService from "./Review.service";
import sendResponse from "../../utils/sendResponse";

export const createReview = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: ICreateReviewBody = {
      courseId: req.params.courseId,
      userId: req.User?.id as string,
      rating: parseFloat(req.body.rating),
      review: req.body.review,
    };
    const result: IResponse = await ReviewService.createReview(data);
    sendResponse(result, res);
  }
);
