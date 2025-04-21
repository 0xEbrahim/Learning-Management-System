import { DefaultEventsMap, Socket } from "socket.io";
import prisma from "../config/prisma";
import { IAddReviewNotificanData } from "../Interfaces/types";

export default (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("addReviewNotification", async (data: IAddReviewNotificanData) => {
    const { authorId, courseName, reviewId } = data;
    const text = `You have a new Review at ${courseName} course`;
    // const notification = await prisma.notification.create({
    //     data:{
    //         recieverId: authorId,
    //         text: text,

    //     }
    // })
    socket.to(authorId).emit("notificationSent", { data: text });
  });
};
