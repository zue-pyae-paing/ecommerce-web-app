import { z } from "zod";


export const addressIdParamsSchema = z.object({
  id: z.string().uuid("Invalid address ID format"),
});


export const createAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(5, "Full name must be at least 5 characters")
    .max(100, "Full name must not exceed 100 characters"),

  region: z.enum(
    [
      "Yangon",
      "Mandalay",
      "Naypyidaw",
      "Bago",
      "Shan",
      "Ayeyarwady",
      "Magway",
      "Kayin",
      "Chin",
      "Mon",
    ],
    {
     message: "Region is required",
    }
  ),

  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(50, "City must not exceed 50 characters"),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^09\d{7,9}$/, "Phone number must be a valid Myanmar number"),

  streetAddress: z
    .string()
    .trim()
    .min(10, "Street address must be at least 10 characters")
    .max(200, "Street address must not exceed 200 characters"),
});