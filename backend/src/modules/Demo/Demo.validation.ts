import { z } from "zod";

export const uploadDemoValidation = z.object({
  params: z.object({
    courseId: z.string(),
  }),
});

export const GetDemoValidation = z.object({
  params: z.object({
    courseId: z.string(),
  }),
});

export const DeleteDemoValidation = z.object({
  params: z.object({
    courseId: z.string(),
  }),
});
