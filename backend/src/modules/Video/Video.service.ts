import fs from "fs";
import cloudinary from "../../config/cloudinary";
import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import { getVideoByIdBody, uploadVideoBody } from "./Video.interface";
import APIError from "../../utils/APIError";

class VideoService {
  async uploadVideo(Payload: uploadVideoBody): Promise<IResponse> {
    const { video, videoLength, videoThumbnail, title, courseId } = Payload;
    let videoThumbnailUpload: any = await cloudinary.uploader.upload(
      videoThumbnail,
      {
        resource_type: "image",
        folder: "Video Thumbnails",
      }
    );
    videoThumbnailUpload = videoThumbnailUpload.secure_url;
    fs.unlinkSync(videoThumbnail);
    let videoUpload: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        video,
        {
          resource_type: "video",
          folder: "Videos",
          chunk_size: 6000000,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
    videoUpload = videoUpload.secure_url;
    fs.unlinkSync(video);
    const Video = await prisma.video.create({
      data: {
        title: title,
        videoLength: Number(videoLength) * 60 * 1000,
        videoThumbnail: videoThumbnailUpload,
        videoUrl: videoUpload,
        courseId: courseId,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 201,
      data: {
        Video,
      },
    };
    return response;
  }

  async getVideoById(Payload: getVideoByIdBody): Promise<IResponse> {
    const { courseId, videoId } = Payload;
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
    });
    if (!video || video.courseId !== courseId)
      throw new APIError("Invalid video ID", 404);
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        video,
      },
    };
    return response;
  }
}

export default new VideoService();
