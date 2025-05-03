import { DefaultEventsMap, Socket } from "socket.io";
import { IAddReviewNotificationData } from "../Interfaces/types";
import NotificationsService from "../modules/Notification/Notifications.service";

export default (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on(
    "addReviewNotification",
    async (data: IAddReviewNotificationData) => {
      const { authorId, reviewId, courseId } = data;
      const notification = await NotificationsService.createNotification(data)
      socket.to(authorId).emit("notificationSent", { notification, reviewId, courseId });
    }
  );
};
