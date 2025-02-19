import { z } from "zod";

export const getUserByIdValidation = z.object({
  params: z.object({
    id: z.string(),
  }),
});
