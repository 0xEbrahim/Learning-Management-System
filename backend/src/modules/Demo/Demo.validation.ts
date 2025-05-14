import { z } from "zod";

const schema = z.object({
  params: z.object({
    courseId: z.string(),
  }),
});
export const uploadDemoValidation = schema;
export const GetDemoValidation = schema;
export const DeleteDemoValidation = schema;
export const UpdateDemoValidation = schema;
