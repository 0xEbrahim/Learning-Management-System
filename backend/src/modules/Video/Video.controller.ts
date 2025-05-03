import { Response, NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler";
import APIError from "../../utils/APIError";
import { IRequest, IResponse } from "../../Interfaces/types";
import VideoService from "./Video.service";
import sendResponse from "../../utils/sendResponse";
import {
  IGetVideosOnCourseBody,
  VideoByIdBody,
  editThumbnailBody,
  editVideo,
  updateVideoBody,
  uploadVideoBody,
} from "./Video.interface";

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
      sectionId: req.body.sectionId,
    };
    const result: IResponse = await VideoService.uploadVideo(data);
    sendResponse(result, res);
  }
);

export const getVideoById = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: VideoByIdBody = {
      courseId: req.params.courseId,
      videoId: req.params.videoId,
    };
    const result: IResponse = await VideoService.getVideoById(data);
    sendResponse(result, res);
  }
);

export const deleteVideo = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: VideoByIdBody = {
      courseId: req.params.courseId,
      videoId: req.params.videoId,
    };
    const result: IResponse = await VideoService.deleteVideo(data);
    sendResponse(result, res);
  }
);

export const updateVideo = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: updateVideoBody = {
      courseId: req.params.courseId,
      videoId: req.params.videoId,
      title: req.body.title,
    };
    const result = await VideoService.updateVideo(data);
    sendResponse(result, res);
  }
);

export const editVideoCtrl = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    let video;
    if (req.files && "video" in req.files) {
      video = req.files.video;
    }
    if (!video) return next(new APIError("You need to provide a video", 400));
    const data: editVideo = {
      courseId: req.params.courseId,
      video: video[0].path,
      videoId: req.params.videoId,
      videoLength: req.body.videoLength,
    };
    const result: IResponse = await VideoService.editVideo(data);
    sendResponse(result, res);
  }
);

export const editThumbnail = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    let videoThumbnail;
    if (req.files && "image" in req.files) {
      videoThumbnail = req.files.image;
    }
    if (!videoThumbnail)
      return next(new APIError("Video's thumbnail is required", 400));
    const data: editThumbnailBody = {
      courseId: req.params.courseId,
      videoId: req.params.videoId,
      thumbnail: videoThumbnail[0].path,
    };
    const result: IResponse = await VideoService.editThumbnail(data);
    sendResponse(result, res);
  }
);

export const getVideosOnCourse = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IGetVideosOnCourseBody = {
      courseId: req.params.courseId,
      userId: req.User?.id as string,
    };
    const result: IResponse = await VideoService.getVideosOnCourse(data);
    sendResponse(result, res);
  }
);
