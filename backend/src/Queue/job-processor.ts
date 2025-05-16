import { Job } from "bullmq";
import sendEmail from "../config/email";

export const jobProcessor = async (job: Job): Promise<any> => {
  console.log("Processing job: ", job.name);
  job.updateProgress(0);
  await sendEmail(job.data);
};
