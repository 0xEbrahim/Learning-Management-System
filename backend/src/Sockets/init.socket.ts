import { Server, DefaultEventsMap, Socket } from "socket.io";
import prisma from "../config/prisma";

export default (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.on(
    "connection",
    (
      socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
    ) => {
      console.log("New socket connected");
      socket.on("initNotification", (data) => {
        socket.join(data.currentAuthenticatedUserId);
        console.log("Current active: ", data.currentAuthenticatedUserId);
      });
      socket.on("view", async (data) => {
        const body = {
          senderId: data.viewId,
          recieverId: data.viewer.id,
          text: data.viewerName + " viewed your profile",
          createdAt: new Date(Date.now()),
          opened: false,
        };
        await prisma.notification.create({
          data: {
            senderId: data.viewId,
            recieverId: data.viewer.id,
            text: data.viewerName + " viewed your profile",
            createdAt: new Date(Date.now()),
            opened: false,
          },
        });
        io.to(data.viewId).emit("sendNotification", body);
      });
    }
  );
};
