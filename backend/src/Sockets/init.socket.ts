import { DefaultEventsMap, Socket } from "socket.io";

export default (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  // console.log("New socket connected: ", socket.id);
  socket.on("init", (data) => {
    socket.join(data.currentAuthenticatedUserId);
    console.log("Current active: ", data.currentAuthenticatedUserId);
  });
};
