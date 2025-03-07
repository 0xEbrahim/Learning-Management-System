import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { updateVideoProgressBody } from "./progress.interface";

class ProgressService {
  async updateVideoProgress(
    Payload: updateVideoProgressBody
  ): Promise<IResponse> {
    const { minutes, userId, videoId } = Payload;
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
    });
    if (!video) throw new APIError("ID did not match any video", 404);
    const order = await prisma.order.findFirst({
      where: {
        courseId: video.courseId,
        userId: userId,
      },
    });
    if (!order)
      throw new APIError("You need to purchase the course first", 403);
    const progress = await prisma.userVideoProgress.upsert({
      where: {
        userId_videoId: {
          userId: userId,
          videoId: videoId,
        },
      },
      update: {
        watchedMinutes: {
          increment: minutes,
        },
      },
      create: {
        userId,
        videoId,
        watchedMinutes: minutes,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        progress,
      },
    };
    return response;
  }
}

export default new ProgressService();
