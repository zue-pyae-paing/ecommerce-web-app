import {z} from "zod";

export const createDeliveryFeeSchema = z.object({
    regionName:z.string().trim().min(1, "Region name is required"),
    feeAmount:z.number().min(0, "Fee amount must be a positive number"),
    minOrderValue:z.number().min(0, "Minimum order value must be a positive number"),
    status:z.boolean().optional()
})

export const deliveryFeeParamIdSchema = z.object({
    id:z.string().uuid("Invalid ID format")
})
