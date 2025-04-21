import { Server, DefaultEventsMap, Socket } from "socket.io";
import initSocket from "./init.socket";
import notificationsSocket from "./notifications.socket";

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
    }
  );
};
