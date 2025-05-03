import prisma from "../../config/prisma";
import { IAddReviewNotificationData } from "../../Interfaces/types";

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
}

export default new NotificationService();
