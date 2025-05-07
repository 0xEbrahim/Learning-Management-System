import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import {
  ICreateProgressBody,
  IDeleteProgressBody,
  IGetProgressBody,
  IUpdateProgressBody,
} from "./progress.interface";
import ResponseFormatter from "../../utils/responseFormatter";

class ProgressService {
  async createProgress(Payload: ICreateProgressBody): Promise<IResponse> {
    const { userId, courseId } = Payload;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      ResponseFormatter.notFound("Course not found");
    }

    const existingProgress = await prisma.userCourseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingProgress) {
      ResponseFormatter.conflict("Progress already exists for this course");
    }

    const progress = await prisma.userCourseProgress.create({
      data: {
        userId,
        courseId,
      },
      include: {
        course: {
          select: {
            name: true,
            thumbnail: true,
          },
        },
      },
    });

    if (!progress) {
      ResponseFormatter.badRequest("Error while creating progress");
    }

    return ResponseFormatter.created({ progress });
  }

  async getProgress(Payload: IGetProgressBody): Promise<IResponse> {
    const { userId, courseId } = Payload;

    const progress = await prisma.userCourseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          select: {
            name: true,
            thumbnail: true,
          },
        },
      },
    });

    if (!progress) {
      ResponseFormatter.notFound("Progress not found");
    }

    return ResponseFormatter.ok({ progress });
  }

  async updateProgress(Payload: IUpdateProgressBody): Promise<IResponse> {
    const { userId, courseId, status, totalWatchedMinutes } = Payload;

    const progress = await prisma.userCourseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!progress) {
      ResponseFormatter.notFound("Progress not found");
    }

    const updatedProgress = await prisma.userCourseProgress.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        status,
        totalWatchedMinutes,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
      include: {
        course: {
          select: {
            name: true,
            thumbnail: true,
          },
        },
      },
    });

    return ResponseFormatter.ok({ progress: updatedProgress });
  }

  async deleteProgress(Payload: IDeleteProgressBody): Promise<IResponse> {
    const { userId, courseId } = Payload;

    const progress = await prisma.userCourseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!progress) {
      ResponseFormatter.notFound("Progress not found");
    }

    await prisma.userCourseProgress.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return ResponseFormatter.ok(
      { message: "Progress deleted successfully" },
      "Progress deleted successfully"
    );
  }

  async updateVideoProgress(
    userId: string,
    videoId: string,
    watchedMinutes: number
  ): Promise<IResponse> {
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      ResponseFormatter.notFound("Video not found");
    }

    const progress = await prisma.userVideoProgress.upsert({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
      update: {
        watchedMinutes,
        lastWatchedAt: new Date(),
      },
      create: {
        userId,
        videoId,
        watchedMinutes,
      },
    });

    return ResponseFormatter.ok({ progress });
  }
}

export default new ProgressService();
