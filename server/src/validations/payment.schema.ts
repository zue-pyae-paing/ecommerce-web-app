import { z } from "zod";

export const createPaymentSchema = z.object({
  transactionId: z
    .string()
    .trim()
    .min(6, "Transaction ID must be at least 6 characters"),

  method: z.enum(["KBZ_PAY", "AYA_PAY", "WAVE_PAY"], {
    message: "Invalid Payment method",
  }),

  senderPhone: z
    .string()
    .trim()
    .regex(/^(?:\+?95)?(9\d{7,9})$/, "Invalid Myanmar phone number format"),

  orderId: z.string().trim().uuid("Invalid order ID format"),
});

export const paymentParamIdSchema = z.object({
  id:  z.string().trim().uuid("Invalid order ID format"),
});
