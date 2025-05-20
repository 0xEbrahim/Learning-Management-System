import { DefaultEventsMap, Socket } from "socket.io";

export default (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("init", (data) => {
    socket.join(data.currentAuthenticatedUserId);
    console.log("Current active: ", data.currentAuthenticatedUserId);
  });
};
