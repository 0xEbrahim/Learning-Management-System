import { z } from "zod";

export const getMessagePrvValidation = z.object({
  params: z.object({
    id: z.string(),
  }),
});
