import { DefaultEventsMap, Socket } from "socket.io";
import { IMessageData } from "../Interfaces/types";
import MessageService from "../modules/Message/Message.service";
import prisma from "../config/prisma";

export default (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("sendMessage", async (data: IMessageData) => {
    const msg: any = await MessageService.create(data);
    const id = msg.privateId;
    const sender = await prisma.user.findUnique({
      where: {
        id: data.senderId,
      },
    });
    const text = `You got a new message from ${sender?.name}`;
    const notification = await MessageService.privateMessageNotification({
      chatId: id,
      receiverId: data.receiverId,
      senderId: data.senderId,
      text: text,
    });
    socket.to(data.receiverId).emit("msgNotification", notification);
    socket.join(id);
    socket.to(id).emit("receiveMessage", { data: msg });
  });

  socket.on("notificationOpened", async (data) => {
    const { id } = data;
    const notification = await MessageService.updateMessageNotification(id);
    socket.join(notification.chatId);
  });
};
