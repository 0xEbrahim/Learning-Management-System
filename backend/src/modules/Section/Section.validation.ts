import { z } from "zod";

export const createSectionValidation = z.object({
  body: z.object({
    courseId: z.string(),
    name: z.string(),
  }),
});

export const getSectionsValidation = z.object({
  body: z.object({
    courseId: z.string(),
  }),
});
