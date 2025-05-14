import { z } from "zod";

export const uploadDemoValidation = z.object({
  params: z.object({
    courseId: z.string(),
  }),
});
