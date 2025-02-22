import { z } from "zod";

export const createCourseValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(6, "Course's name cannot be less than 6 charcters")
      .max(25, "Course's name cannot be more than 25 charcters"),
    price: z.number(),
    description: z
      .string()
      .min(20, "Description should bne more than 20 charcters"),
  }),
});
