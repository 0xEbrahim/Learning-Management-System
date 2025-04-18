import { NextFunction, Response } from "express";
import { IRequest, IResponse } from "../../Interfaces/types";
import asyncHandler from "../../utils/asyncHandler";
import { IReplyOnReviewBody } from "./Reply.interface";
import ReplyService from "./Reply.service";
import sendResponse from "../../utils/sendResponse";

export const ReplyOnReview = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IReplyOnReviewBody = {
      comment: req.body.comment,
      reviewId: req.params.id,
      userId: req.User?.id ?? "",
      courseId: req.params.courseId,
    };
    const result: IResponse = await ReplyService.replyOnReview(data);
    sendResponse(result, res);
  }
);
