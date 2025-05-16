import { Queue, Job } from "bullmq";
import env from "../config/env";

export const queue = new Queue("emailQ", {
  connection: {
    url: env.REDIS_QUEUE_URL,
  },
});

const REMOVE_CONFIG = {
  removeOnComplete: {
    age: 60 * 60,
  },
  removeOnFail: {
    age: 24 * 60 * 60,
  },
};

export async function addJobToQueue<T>(name: string, data: T): Promise<Job<T>> {
  return await queue.add(name, data, REMOVE_CONFIG);
}
