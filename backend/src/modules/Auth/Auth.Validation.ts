import { z } from "zod";

export const registerValidation = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(6, "Name should be 6 characters at minimum")
        .max(20, "Name cannot be more than 20 charcters"),
      email: z.string().email({ message: "Invalid email address" }),
      password: z.string().min(6, "password should be more than 6 characters"),
      confirmPassword: z
        .string()
        .min(6, "password should be more than 6 characters"),
      role: z.enum(["TEACHER", "STUDENT"]),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["Password confirmations"],
    }),
});

export const loginValidation = z.object({
  body: z.object({
    email: z.string().email({ message: "Enter a valid email" }),
    password: z.string(),
  }),
});

export const emailVerificationValidation = z.object({
  params: z.object({
    token: z.string(),
  }),
});

export const forgotPasswordValidation = z.object({
  body: z.object({
    email: z.string().email({ message: "Enter a valid email" }),
  }),
});

export const resetPasswordValidation = z.object({
  body: z
    .object({
      token: z.string(),
      password: z.string().min(6, "password should be more than 6 characters"),
      confirmPassword: z
        .string()
        .min(6, "password should be more than 6 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["Password confirmations"],
    }),
});
