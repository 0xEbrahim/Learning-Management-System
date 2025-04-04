import { z } from "zod";

export const uploadVideoValidation = z.object({
  body: z.object({
    title: z
      .string()
      .min(6, "Too short video title")
      .max(300, "Too long video title"),
    videoLength: z.string(),
  }),
  params: z.object({
    courseId: z.string(),
  }),
});

export const VideoValidation = z.object({
  params: z.object({
    courseId: z.string(),
    videoId: z.string(),
  }),
});

export const updateVideoValidation = z.object({
  body: z.object({
    title: z
      .string()
      .min(6, "Too short video title")
      .max(300, "Too long video title"),
  }),
  params: z.object({
    courseId: z.string(),
    videoId: z.string(),
  }),
});

export const getVideoOnCourseValidation = z.object({
  params: z.object({
    courseId: z.string(),
  }),
});
