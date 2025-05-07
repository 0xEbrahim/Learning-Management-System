import { z } from "zod";

export const createSectionValidation = z.object({
  params: z.object({
    courseId: z.string(),
    name: z.string(),
  }),
});

export const getSectionsValidation = z.object({
  params: z.object({
    courseId: z.string(),
  }),
});

export const getSectionByIdValidation = z.object({
  params: z.object({
    id: z.string(),
    courseId: z.string(),
  }),
});

export const deleteSectionByIdValidation = z.object({
  params: z.object({
    id: z.string(),
    courseId: z.string(),
  }),
});
