import { z } from "zod";

export const createProductSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters" })
    .max(50, { message: "Product name must be at most 50 characters" }),
  description: z
    .string()
    .min(10, { message: "Product description must be at least 10 characters" })
    .max(500, {
      message: "Product description must be at most 500 characters",
    }),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),

  categoryId: z.string().ulid(),
});

export const productIdParamSchema = z.object({
  id: z.string().uuid("Invalid product ID format"),
});
