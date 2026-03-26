import { z } from "zod";

export const registerSchema = z
  .object({
    userName: z
      .string()
      .min(3, { message: "UserName must be at least 3 characters" })
      .max(20, { message: "UserName must be at most 20 characters" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
