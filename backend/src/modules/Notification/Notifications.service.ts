import prisma from "../../config/prisma";
import { IAddReviewNotificationData, IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";

class NotificationService {
  async createNotification(Payload: IAddReviewNotificationData): Promise<any> {
    const { authorId, courseName, reviewId, courseId } = Payload;
    const text = `You have a new Review at ${courseName} course`;
    const notification = await prisma.notification.create({
      data: {
        recieverId: authorId,
        text: text,
        reviewId: reviewId,
        courseId: courseId,
      },
    });
    return notification;
  }

  async updateNotificationStatus(Payload: string): Promise<any> {
    let notification = await prisma.notification.findFirst({
      where: {
        id: Payload,
      },
    });
    if (!notification) throw new APIError("Invalid notification ID", 404);
    notification = await prisma.notification.update({
      where: {
        id: Payload,
      },
      data: {
        opened: true,
      },
    });
    return notification;
  }

  async getNotifications(Payload: string): Promise<IResponse> {
    const notification = await prisma.notification.findMany({
      where: {
        recieverId: Payload,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        notification,
      },
    };
    return response;
  }
}

export default new NotificationService();
