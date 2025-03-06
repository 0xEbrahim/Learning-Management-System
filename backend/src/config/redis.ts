import { createClient } from "redis";
import config from "./env";

const client = createClient({
  username: config.REDIS_USERNAME,
  password: config.REDIS_PASSWORD,
  socket: {
    host: config.REDIS_SOCKET_HOST,
    port: config.REDIS_SOCKET_PORT,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

client.connect().then(() => console.log("Redis connected successfully"));

export default client;
