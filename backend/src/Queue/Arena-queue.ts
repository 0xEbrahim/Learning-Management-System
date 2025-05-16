import Arena from "bull-arena";
import env from "../config/env";
export const arenaConfig = Arena(
  {
    BullMQ: require("bullmq").Queue,
    queues: [
      {
        type: "bullmq",
        name: "emailQ",
        hostId: "server",
        redis: {
          url: env.REDIS_QUEUE_URL,
        },
      },
    ],
  },
  {
    basePath: "/arena",
  }
);
