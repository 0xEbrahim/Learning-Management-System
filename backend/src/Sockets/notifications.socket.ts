import { DefaultEventsMap, Socket } from "socket.io";
import prisma from "../config/prisma";
import { IAddReviewNotificationData } from "../Interfaces/types";

export default (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on(
    "addReviewNotification",
    async (data: IAddReviewNotificationData) => {
      const { authorId, courseName, reviewId, courseId } = data;
      const text = `You have a new Review at ${courseName} course`;
      console.log("Author: ", data);
      const notification = await prisma.notification.create({
        data: {
          recieverId: authorId,
          text: text,
        },
      });
      socket.to(authorId).emit("notificationSent", { notification, reviewId, courseId });
    }
  );
};
