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
import {
  cleanVideoData,
} from "../../utils/Functions/functions";
import ResponseFormatter from "../../utils/responseFormatter";
import redis from "../../config/redis";

class VideoService {
  private readonly CACHE_TTL = 3600;

  private VIDEO_CACHE_KEY(videoId: string, courseId: string): string {
    return `video:${courseId}:${videoId}`;
  }

  private VIDEOS_COURSE_CACHE_KEY(courseId: string): string {
    return `videos:course:${courseId}`;
  }

  async uploadVideo(Payload: uploadVideoBody): Promise<IResponse> {
    const {
      video,
      videoLength,
      videoThumbnail,
      title,
      courseId,
      sectionId,
    } = Payload;
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

    await redis.del(this.VIDEOS_COURSE_CACHE_KEY(courseId));

    return ResponseFormatter.created({ Video });
  }

  async getVideoById(Payload: VideoByIdBody): Promise<IResponse> {
    const { courseId, videoId } = Payload;

    const cachedVideo = await redis.get(
      this.VIDEO_CACHE_KEY(videoId, courseId)
    );
    if (cachedVideo) {
      return ResponseFormatter.ok(
        { video: JSON.parse(cachedVideo) },
        "Video retrieved from cache",
        { fromCache: true }
      );
    }

    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        courseId: courseId,
      },
    });
    if (!video) ResponseFormatter.notFound("Invalid video ID");

    await redis.setEx(
      this.VIDEO_CACHE_KEY(videoId, courseId),
      this.CACHE_TTL,
      JSON.stringify(video)
    );

    return ResponseFormatter.ok({ video }, "Video retrieved successfully", {
      fromCache: false,
      cacheTTL: this.CACHE_TTL,
    });
  }

  async deleteVideo(Payload: VideoByIdBody): Promise<IResponse> {
    const { courseId, videoId } = Payload;
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        courseId: courseId,
      },
    });
    if (!video) ResponseFormatter.notFound("Invalid video ID");
    await prisma.video.delete({
      where: {
        id: videoId,
      },
    });

    await Promise.all([
      redis.del(this.VIDEO_CACHE_KEY(videoId, courseId)),
      redis.del(this.VIDEOS_COURSE_CACHE_KEY(courseId)),
    ]);

    return ResponseFormatter.ok(
      { message: "Video deleted successfully" },
      "Video deleted successfully"
    );
  }

  async updateVideo(Payload: updateVideoBody): Promise<IResponse> {
    const { courseId, title, videoId } = Payload;
    let video = await prisma.video.findFirst({
      where: {
        id: videoId,
        courseId: courseId,
      },
    });
    if (!video) ResponseFormatter.notFound("Invalid video ID");
    video = await prisma.video.update({
      where: {
        id: videoId,
        courseId: courseId,
      },
      data: {
        title: title,
      },
    });

    await Promise.all([
      redis.del(this.VIDEO_CACHE_KEY(videoId, courseId)),
      redis.del(this.VIDEOS_COURSE_CACHE_KEY(courseId)),
    ]);

    return ResponseFormatter.ok({ video }, "Video updated successfully");
  }

  async editVideo(Payload: editVideo): Promise<IResponse> {
    const { courseId, videoId, video, videoLength } = Payload;
    let Video = await prisma.video.findFirst({
      where: {
        id: videoId,
        courseId: courseId,
      },
    });
    if (!Video) ResponseFormatter.notFound("Invalid video ID");
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

    await Promise.all([
      redis.del(this.VIDEO_CACHE_KEY(videoId, courseId)),
      redis.del(this.VIDEOS_COURSE_CACHE_KEY(courseId)),
    ]);

    return ResponseFormatter.ok({ Video });
  }

  async editThumbnail(Payload: editThumbnailBody): Promise<IResponse> {
    const { courseId, thumbnail, videoId } = Payload;
    let video = await prisma.video.findFirst({
      where: {
        id: videoId,
        courseId: courseId,
      },
    });
    if (!video) ResponseFormatter.notFound("Invalid video ID");
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

    // Invalidate caches
    await Promise.all([
      redis.del(this.VIDEO_CACHE_KEY(videoId, courseId)),
      redis.del(this.VIDEOS_COURSE_CACHE_KEY(courseId)),
    ]);

    return ResponseFormatter.ok({ video });
  }

  async getVideosOnCourse(Payload: IGetVideosOnCourseBody): Promise<IResponse> {
    const { courseId, userId } = Payload;

    const cachedVideos = await redis.get(
      this.VIDEOS_COURSE_CACHE_KEY(courseId)
    );
    if (cachedVideos) {
      const videos = JSON.parse(cachedVideos);
      return ResponseFormatter.ok({ videos }, "Videos retrieved from cache", {
        fromCache: true,
      });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        courseData: true,
      },
    });
    if (!course) ResponseFormatter.notFound("Invalid course ID: " + courseId);
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

    await redis.setEx(
      this.VIDEOS_COURSE_CACHE_KEY(courseId),
      this.CACHE_TTL,
      JSON.stringify(videos)
    );

    return ResponseFormatter.ok({ videos }, "Videos retrieved successfully", {
      fromCache: false,
      cacheTTL: this.CACHE_TTL,
    });
  }
}

export default new VideoService();
