import { Response, NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler";
import APIError from "../../utils/APIError";
import { IRequest, IResponse } from "../../Interfaces/types";
import VideoService from "./Video.service";
import sendResponse from "../../utils/sendResponse";
import { uploadVideoBody } from "./Video.interface";

export const uploadVideo = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    let videoThumbnail, video;
    if (req.files && "image" in req.files) {
      videoThumbnail = req.files.image;
    }
    if (req.files && "video" in req.files) {
      video = req.files.video;
    }
    if (!videoThumbnail)
      return next(new APIError("Video's thumbnail is required", 400));
    if (!video) return next(new APIError("You need to provide a video", 400));

    const data: uploadVideoBody = {
      videoLength: req.body.videoLength,
      title: req.body.title,
      videoThumbnail: videoThumbnail[0].path,
      courseId: req.params.courseId,
      video: video[0].path,
    };
    const result: IResponse = await VideoService.uploadVideo(data);
    sendResponse(result, res);
  }
);
