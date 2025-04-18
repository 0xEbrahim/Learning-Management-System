import { z } from "zod";

export const replyOnReviewValidation = z.object({
  body: z.object({
    comment: z.string(),
  }),
  params: z.object({
    courseId: z.string(),
    id: z.string(),
  }),
});
