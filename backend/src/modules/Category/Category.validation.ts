import { z } from "zod";

export const createCategoryValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Category name can't be less than 6 characters")
      .max(25, "Category name is too long"),
  }),
});

export const getCategoryByIdValidation = z.object({
  params: z.object({
    id: z.string(),
  }),
});
