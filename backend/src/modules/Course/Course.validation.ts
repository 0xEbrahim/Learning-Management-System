import { z } from "zod";

export const createCourseValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(6, "Course's name cannot be less than 6 charcters")
      .max(25, "Course's name cannot be more than 25 charcters"),
    price: z.string(),
    description: z
      .string()
      .min(20, "Description should bne more than 20 charcters"),
  }),
});

export const getCourseByIdValidation = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const deleteCourseValidation = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const updateCourseValidation = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z
      .string()
      .min(6, "Course's name cannot be less than 6 characters")
      .max(25, "Course's name cannot be more than 25 characters")
      .optional(),
    price: z.string().optional(),
    description: z
      .string()
      .min(20, "Description should be more than 20 characters")
      .optional(),
    categories: z.array(z.string()).optional(),
  }),
});

export const updateCourseThumbnailValidation = z.object({
  params: z.object({
    id: z.string(),
  }),
});
