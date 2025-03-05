import { Server, DefaultEventsMap, Socket } from "socket.io";

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
        socket.join(data.userId);
        console.log("User joined his group");
      });
    }
  );
};
