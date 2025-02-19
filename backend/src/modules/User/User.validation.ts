import { z } from "zod";

const getUserByIdValidation = z.object({
  params: z.object({
    id: z.string(),
  }),
});
