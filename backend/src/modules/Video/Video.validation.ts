import { z } from "zod";

const courseIdSchema = z.string().uuid("Invalid course ID format");
const videoIdSchema = z.string().uuid("Invalid video ID format");
const sectionIdSchema = z.string().uuid("Invalid section ID format");

export const uploadVideoValidation = z.object({
  body: z.object({
    title: z
      .string()
      .min(6, "Video title must be at least 6 characters")
      .max(300, "Video title cannot exceed 300 characters")
      .trim()
      .regex(
        /^[a-zA-Z0-9\s\-_.,!?()]+$/,
        "Video title can only contain letters, numbers, spaces, and basic punctuation"
      ),
    videoLength: z.string(),
    sectionId: sectionIdSchema,
  }),
  params: z.object({
    courseId: courseIdSchema,
  }),
});

export const updateVideoValidation = z.object({
  body: z.object({
    title: z
      .string()
      .min(6, "Video title must be at least 6 characters")
      .max(300, "Video title cannot exceed 300 characters")
      .trim()
      .regex(
        /^[a-zA-Z0-9\s\-_.,!?()]+$/,
        "Video title can only contain letters, numbers, spaces, and basic punctuation"
      ),
  }),
  params: z.object({
    courseId: courseIdSchema,
    videoId: videoIdSchema,
  }),
});

export const editVideoValidation = z.object({
  body: z.object({
    videoLength: z
      .string()
      .regex(/^\d+$/, "Video length must be a positive number")
      .refine((val) => parseInt(val) > 0, {
        message: "Video length must be greater than 0",
      }),
  }),
  params: z.object({
    courseId: courseIdSchema,
    videoId: videoIdSchema,
  }),
});

export const getVideoByIdValidation = z.object({
  params: z.object({
    courseId: courseIdSchema,
    videoId: videoIdSchema,
  }),
});

export const getVideosOnCourseValidation = z.object({
  params: z.object({
    courseId: courseIdSchema,
  }),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sort: z.string().optional(),
  }),
});

export const deleteVideoValidation = z.object({
  params: z.object({
    courseId: courseIdSchema,
    videoId: videoIdSchema,
  }),
});
