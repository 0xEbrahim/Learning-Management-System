import { DefaultEventsMap, Socket } from "socket.io";
import { IMessageData } from "../Interfaces/types";
import MessageService from "../modules/Message/Message.service";

export default (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("sendMessage", async (data: IMessageData) => {
    const msg: any = await MessageService.create(data);
    const id = msg.privateId;
    socket.to(id).emit("messageSent", { data: msg });
  });
};
