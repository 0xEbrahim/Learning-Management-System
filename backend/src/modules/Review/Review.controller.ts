import { NextFunction, Response } from "express";
import { IRequest, IResponse } from "../../Interfaces/types";
import asyncHandler from "../../utils/asyncHandler";
import {
  ICreateReviewBody,
  IGetReviewByIdBody,
  IGetReviewsOnCourseBody,
} from "./Review.interface";
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

export const getReviewById = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IGetReviewByIdBody = {
      courseId: req.params.courseId,
      reviewId: req.params.id,
    };
    const result: IResponse = await ReviewService.getReviewById(data);
    sendResponse(result, res);
  }
);

export const getReviewsOnCourse = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IGetReviewsOnCourseBody = {
      courseId: req.params.courseId,
      query: req.query,
    };
    const result = await ReviewService.getReviewsOnCourse(data);
    sendResponse(result, res);
  }
);
