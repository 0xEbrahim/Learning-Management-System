import { z } from "zod";

export const createReviewValidation = z.object({
  body: z.object({
    review: z.string(),
    rating: z.number(),
  }),
  params: z.object({
    courseId: z.string(),
  }),
});

export const getReviewByIdValidation = z.object({
  params:z.object({
    courseId: z.string(),
    id: z.string()
  })
})
