import fs from "fs";
import cloudinary from "../../config/cloudinary";
import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import {
  IGetVideosOnCourseBody,
  VideoByIdBody,
  editThumbnailBody,
  editVideo,
  updateVideoBody,
  uploadVideoBody,
} from "./Video.interface";
import APIError from "../../utils/APIError";
import { cleanVideoData } from "../../utils/Functions/functions";

class VideoService {
  async uploadVideo(Payload: uploadVideoBody): Promise<IResponse> {
    const { video, videoLength, videoThumbnail, title, courseId, sectionId } =
      Payload;
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
        videoLength: Number(videoLength) * 60,
        videoThumbnail: videoThumbnailUpload,
        videoUrl: videoUpload,
        courseId: courseId,
        sectionId: sectionId,
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

  async getVideoById(Payload: VideoByIdBody): Promise<IResponse> {
    const { courseId, videoId } = Payload;
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        courseId: courseId,
      },
    });
    if (!video) throw new APIError("Invalid video ID", 404);
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        video,
      },
    };
    return response;
  }

  async deleteVideo(Payload: VideoByIdBody): Promise<IResponse> {
    const { courseId, videoId } = Payload;
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        courseId: courseId,
      },
    });
    if (!video) throw new APIError("Invalid video ID", 404);
    await prisma.video.delete({
      where: {
        id: videoId,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      message: "Video deleted successfully",
    };
    return response;
  }

  async updateVideo(Payload: updateVideoBody): Promise<IResponse> {
    const { courseId, title, videoId } = Payload;
    let video = await prisma.video.findFirst({
      where: {
        id: videoId,
        courseId: courseId,
      },
    });
    if (!video) throw new APIError("Invalid video ID", 404);
    video = await prisma.video.update({
      where: {
        id: videoId,
        courseId: courseId,
      },
      data: {
        title: title,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      message: "Video updated successfully",
      data: {
        video,
      },
    };
    return response;
  }
  async editVideo(Payload: editVideo): Promise<IResponse> {
    const { courseId, videoId, video, videoLength } = Payload;
    let Video = await prisma.video.findFirst({
      where: {
        id: videoId,
        courseId: courseId,
      },
    });
    if (!Video) throw new APIError("Invalid video ID", 404);
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
    Video = await prisma.video.update({
      where: {
        id: videoId,
        courseId: courseId,
      },
      data: {
        videoUrl: videoUpload,
        videoLength: Number(videoLength) * 60,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        Video,
      },
    };
    return response;
  }

  async editThumbnail(Payload: editThumbnailBody): Promise<IResponse> {
    const { courseId, thumbnail, videoId } = Payload;
    let video = await prisma.video.findFirst({
      where: {
        id: videoId,
        courseId: courseId,
      },
    });
    if (!video) throw new APIError("Invalid video ID", 404);
    let videoThumbnailUpload: any = await cloudinary.uploader.upload(
      thumbnail,
      {
        resource_type: "image",
        folder: "Video Thumbnails",
      }
    );
    videoThumbnailUpload = videoThumbnailUpload.secure_url;
    fs.unlinkSync(thumbnail);
    video = await prisma.video.update({
      where: {
        id: videoId,
        courseId: courseId,
      },
      data: {
        videoThumbnail: videoThumbnailUpload,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        video,
      },
    };
    return response;
  }

  async getVideosOnCourse(Payload: IGetVideosOnCourseBody): Promise<IResponse> {
    const { courseId, userId } = Payload;
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        courseData: true,
      },
    });
    if (!course) throw new APIError("Invalid course ID: " + courseId, 404);
    const videos = course.courseData;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        courses: true,
        publishedCourses: true,
      },
    });

    const purchasedOrOwned =
      user?.courses.some((el) => el.courseId === courseId) ||
      user?.publishedCourses.some((el) => el.id === courseId);
    if (!purchasedOrOwned) {
      for (let i = 0; i < videos.length; i++) cleanVideoData(videos[i]);
    }
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        videos,
      },
    };
    return response;
  }
}

export default new VideoService();
