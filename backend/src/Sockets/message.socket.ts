import { DefaultEventsMap, Socket } from "socket.io";
import { IMessageData } from "../Interfaces/types";
import MessageService from "../modules/Message/Message.service";

export default (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("sendMessage", async (data: IMessageData) => {
    const { roomId } = data;
    const msg = await MessageService.create(data);
    socket.to(roomId).emit("messageSent", msg);
  });
};
