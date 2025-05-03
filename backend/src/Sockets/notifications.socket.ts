import { DefaultEventsMap, Socket } from "socket.io";
import { IAddReviewNotificationData } from "../Interfaces/types";
import NotificationsService from "../modules/Notification/Notifications.service";
import APIError from "../utils/APIError";

export default (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on(
    "addReviewNotification",
    async (data: IAddReviewNotificationData) => {
      const { authorId, reviewId, courseId } = data;
      const notification = await NotificationsService.createNotification(data);
      socket
        .to(authorId)
        .emit("notificationSent", { notification });
    }
  );
  socket.on("openedNotification", async (data) => {
    const { notificationId } = data;
    try {
      await NotificationsService.updateNotificationStatus(notificationId);
    } catch (e: any) {
      throw new APIError(e.message, e.statusCode);
    }
  });
};
