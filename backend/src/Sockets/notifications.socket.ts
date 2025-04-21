import { DefaultEventsMap, Socket } from "socket.io";
import prisma from "../config/prisma";
import { IAddReviewNotificanData } from "../Interfaces/types";

export default (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("addReviewNotification", async (data: IAddReviewNotificanData) => {
    const { authorId, courseName, reviewId } = data;
    const text = `You have a new Review at ${courseName} course`;
    socket.to(authorId).emit("notificationSent", { data: text });
  });
};
