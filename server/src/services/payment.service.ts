import { send } from "node:process";
import { Prisma } from "../../generated/prisma/index.js";
import {
  CreatePaymentDto,
  GetAllPaymentDto,
  GetAllUserPaymentDto,
} from "../dtos/payment.dto.js";
import { prisma } from "../lib/prisma.js";
import createError from "http-errors";

const paymentService = {
  async getAllPayments(dto: GetAllPaymentDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;
    const orderBy: Prisma.PaymentOrderByWithRelationInput = dto.sort
      ? { [dto.sort]: dto.order }
      : { createdAt: "asc" };
    const where: Prisma.PaymentWhereInput = {};
    if (dto.search) {
      where.OR = [
        { order: { orderCode: { contains: dto.search, mode: "insensitive" } } },
        { transactionId: { contains: dto.search, mode: "insensitive" } },
      ];
    }

    const payments = await prisma.payment.findMany({
      where: { ...where },
      orderBy,
      take: limit,
      skip,
    });
    const totalItems = await prisma.payment.count({ where: { ...where } });
    const meta = {
      currentPage: page,
      totalPage: Math.ceil(totalItems / limit),
      totalItems,
      pageSize: limit,
      hasNextPage: page < Math.ceil(totalItems / limit),
    };
    return { payments, meta };
  },

  async getUserPayments(dto: GetAllUserPaymentDto) {
    const limit = dto.limit ?? 10;
    const orderBy: Prisma.PaymentOrderByWithRelationInput = dto.sort
      ? { [dto.sort]: dto.order }
      : { createdAt: "asc" };

    const where: Prisma.PaymentWhereInput = {};
    if (dto.search) {
      where.OR = [
        { order: { orderCode: { contains: dto.search, mode: "insensitive" } } },
        { transactionId: { contains: dto.search, mode: "insensitive" } },
      ];
    }

    const payments = await prisma.payment.findMany({
      where: { userId: dto.userId, ...where },
      orderBy,
      take: limit,
      skip: dto.cursor ? 1 : 0,
      cursor: dto.cursor ? { id: dto.cursor } : undefined,
    });
    const totalItems = await prisma.payment.count({
      where: { userId: dto.userId, ...where },
    });
    const nextCursor =
      payments.length === limit ? payments[payments.length - 1].id : null;
    const meta = {
      nextCursor,
      total: totalItems,
      hasMore: nextCursor ? true : false,
    };
    return { payments, meta };
  },

  async getPaymentById(id: string) {
    if (!id) throw createError.BadRequest("Payment id not found");

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { order: true, user: { select: { userNmae: true } } },
    });

    if (!payment) throw createError.NotFound("Payment not found!");

    return payment;
  },

  async createPayment(dto: CreatePaymentDto) {
    if (!dto.orderId) throw createError.BadRequest("Order id not found");
    if (!dto.method) throw createError.BadRequest("Payment method not found");
    const order = await prisma.order.findUnique({ where: { id: dto.orderId } });
    if (!order) throw createError.NotFound("Order not found");

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          method: dto.method,
          transactionId: dto.transactionId,
          senderPhone: dto.senderPhone,
          amount: new Prisma.Decimal(order.total),
          order: { connect: { id: dto.orderId } },
        },
      });

      await tx.order.update({
        where: { id: dto.orderId },
        data: { status: "PAID" },
      });

      return payment;
    });

    return result;
  },
  async updatePaymentStatus(
    paymentId: string,
    status: "PENDING" | "PAID"  
  ) {
    if (!paymentId) throw createError.BadRequest("Payment id not found");
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    });
    return payment;
  },
};

export default paymentService;
