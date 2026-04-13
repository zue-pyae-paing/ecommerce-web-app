import { CreateDeliveryFeeDto } from "../dtos/deliveryFee.dto.js";
import { prisma } from "../lib/prisma.js";
import createError from "http-errors";
import { Prisma } from "../../generated/prisma/index.js";

const deliveryFeeService = {
  async getAllDeliveryFees() {
    return await prisma.deliveryFee.findMany({
      orderBy: { createdAt: "desc" },
    });
  },


  async getOneDeliveryFee(id: string) {
    if (!id) throw createError.BadRequest("Delivery fee id not found");

    const deliveryFee = await prisma.deliveryFee.findUnique({
      where: { id },
    });

    if (!deliveryFee) {
      throw createError.NotFound("Delivery fee not found");
    }

    return deliveryFee;
  },


  async createDeliveryFee(dto: CreateDeliveryFeeDto) {
    return await prisma.deliveryFee.create({
      data: dto,
    });
  },


  async updateDeliveryFee(id: string, dto: CreateDeliveryFeeDto) {
    if (!id) throw createError.BadRequest("Delivery fee id not found");

    return await prisma.deliveryFee.update({
      where: { id },
      data: dto,
    });
  },

  
  async applyDeliveryFee(orderId: string, deliveryFeeId: string) {
    if (!orderId) throw createError.BadRequest("Order id not found");
    if (!deliveryFeeId) throw createError.BadRequest("Delivery fee id not found");

    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
      });

      if (!order) throw createError.NotFound("Order not found");

      const deliveryFee = await tx.deliveryFee.findUnique({
        where: { id: deliveryFeeId },
      });

      if (!deliveryFee) throw createError.NotFound("Delivery fee not found");

      const fee = new Prisma.Decimal(deliveryFee.feeAmount);

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          deliveryFee: fee,
          total: {
            increment: fee,
          },
        },
      });

      return {
        data: updatedOrder,
        message: "Delivery fee applied successfully",
      };
    });
  },

  async deleteDeliveryFee(id: string) {
    if (!id) throw createError.BadRequest("Delivery fee id not found");

    return await prisma.deliveryFee.delete({
      where: { id },
    });
  },
};

export default deliveryFeeService;