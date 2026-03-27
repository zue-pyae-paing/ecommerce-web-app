import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Category name must be at least 3 characters" })
    .max(50, { message: "Category name must be at most 50 characters" }),
  description: z
    .string()
    .min(3, { message: "Category description must be at least 3 characters" })
    .max(100, {
      message: "Category description must be at most 100 characters",
    }),
  status: z.boolean({ message: "Category status is required" }),
});

export const paramsSchema = z.object({ id: z.string().ulid() });
