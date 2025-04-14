import { z } from "zod";

export const createReviewValidation = z.object({
  body: z.object({
    review: z.string(),
    rating: z.string(),
  }),
  params: z.object({
    courseId: z.string(),
  }),
});
