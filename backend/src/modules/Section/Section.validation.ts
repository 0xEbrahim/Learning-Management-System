import { z } from "zod";

export const createSectionValidation = z.object({
  body: z.object({
    courseId: z.string(),
    name: z.string(),
  }),
});
