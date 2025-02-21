import { z } from "zod";

export const getUserByIdValidation = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const updateUserValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(6, "Name should be 6 characters at minimum")
      .max(20, "Name cannot be more than 20 charcters"),
  }),
});
