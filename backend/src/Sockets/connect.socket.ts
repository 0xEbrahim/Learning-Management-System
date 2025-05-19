import { Server, DefaultEventsMap, Socket } from "socket.io";
import initSocket from "./init.socket";
import notificationsSocket from "./notifications.socket";
import messageSocket from "./message.socket";

export default (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.on(
    "connection",
    (
      socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
    ) => {
      initSocket(socket);
      notificationsSocket(socket);
      messageSocket(socket);
    }
  );
  io.on(
    "disconnect",
    (
      socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
    ) => {
      console.log(`${socket.id} diconnected`);
    }
  );
};
