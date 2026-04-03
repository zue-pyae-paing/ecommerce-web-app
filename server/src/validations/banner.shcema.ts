import { z } from "zod";

export const createBannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date().min(new Date(), "Start date must be in the future"),
  endDate: z.date().min(new Date(), "End date must be in the future"),
});

export const updateBannerSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  startDate: z
    .date()
    .min(new Date(), "Start date must be in the future")
    .optional(),
  endDate: z
    .date()
    .min(new Date(), "End date must be in the future")
    .optional(),
  isActive: z.boolean().optional(),
});

export const bannerIdParamSchema = z.object({
  id: z.string().uuid("Invalid banner ID format"),
});
