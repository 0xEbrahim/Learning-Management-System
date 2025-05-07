import { z } from "zod";

const courseIdSchema = z.string().uuid("Invalid course ID format");

export const createSectionValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Section name must be at least 3 characters")
      .max(100, "Section name cannot exceed 100 characters")
      .trim()
      .regex(
        /^[a-zA-Z0-9\s\-_]+$/,
        "Section name can only contain letters, numbers, spaces, hyphens, and underscores"
      ),
  }),
  params: z.object({
    courseId: courseIdSchema,
  }),
});

export const getSectionsValidation = z.object({
  params: z.object({
    courseId: courseIdSchema,
  }),
});

export const getSectionByIdValidation = z.object({
  params: z.object({
    courseId: courseIdSchema,
    id: z.string().uuid("Invalid section ID format"),
  }),
});

export const deleteSectionByIdValidation = z.object({
  params: z.object({
    courseId: courseIdSchema,
    id: z.string().uuid("Invalid section ID format"),
  }),
});
