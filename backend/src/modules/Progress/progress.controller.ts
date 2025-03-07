import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { IRequest } from "../../Interfaces/types";
import { updateVideoProgressBody } from "./progress.interface";
import progressService from "./progress.service";
import sendResponse from "../../utils/sendResponse";

export const updateVideoProgress = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: updateVideoProgressBody = {
      userId: req.User?.id as string,
      videoId: req.params.videoId,
      minutes: req.body.minutes,
    };
    const result = await progressService.updateVideoProgress(data);
    sendResponse(result, res);
  }
);
