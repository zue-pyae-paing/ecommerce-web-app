import { Prisma } from "../../generated/prisma/index.js";
import {
  ApplyCouponDto,
  CreateCouponDto,
  GetAllCouponDto,
} from "../dtos/coupon.dto.js";
import { prisma } from "../lib/prisma.js";

import createError from "http-errors";
const couponService = {
  getAllCoupons: async (dto: GetAllCouponDto) => {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    const skip = (page - 1) * limit;
    const orderBy: Prisma.CouponOrderByWithRelationInput = dto.sort
      ? { [dto.sort]: dto.order }
      : { createdAt: "asc" };

    const coupons = await prisma.coupon.findMany({
      where: { description: { contains: dto.search } },
      skip,
      take: limit,
      orderBy,
    });
    const totalItems = await prisma.coupon.count();
    const meta = {
      currentPage: page,
      totalPage: Math.ceil(totalItems / limit),
      totalItems,
      pageSize: limit,
      hasNextPage: page < Math.ceil(totalItems / limit),
    };
    return { coupons, meta };
  },
  getOneCoupon: async (id: string) => {
    if (!id) throw createError.BadRequest("Coupon ID is required");
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw createError.NotFound("Coupon not found");
    return coupon;
  },
  createCoupon: async (dto: CreateCouponDto) => {
    if (dto.discountType === "PERCENTAGE") {
      if (dto.discountValue < 0 || dto.discountValue > 100) {
        throw createError.BadRequest(
          "For percentage discount, value must be between 0 and 100",
        );
      }
    }
    const randonKey = Math.random().toString(36).substring(2, 8).toUpperCase();
    const couponCode = `${dto.code}-${randonKey}`;
    const newCoupon = await prisma.coupon.create({
      data: {
        code: couponCode,
        discountValue: dto.discountValue,
        description: dto.description,
        maxUses: dto.maxUses,
        minOrderValue: dto.minOrderValue,
        discountType: dto.discountType,
        startDate: dto.startDate,
        endDate: dto.endDate,
        applicableCategoryId: dto.applicableCategoryId,
        applicableProductId: dto.applicableProductId,
      },
    });
    return newCoupon;
  },
  applyCoupon: async (dto: ApplyCouponDto) => {
    const { code, totalAmount, applicableCategoryId, applicableProductId } =
      dto;
    if (!code) throw createError.BadRequest("Coupon code is required");
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) throw createError.NotFound("Coupon not found");
    const currentDate = new Date();
    if (coupon.startDate > currentDate || coupon.endDate < currentDate) {
      throw createError.BadRequest("Coupon is not valid at this time");
    }
    if (coupon.minOrderValue && totalAmount < Number(coupon.minOrderValue)) {
      throw createError.BadRequest(
        `Minimum order value for this coupon is ${coupon.minOrderValue}`,
      );
    }
    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (totalAmount * Number(coupon.discountValue)) / 100;
    } else {
      discountAmount = Number(coupon.discountValue);
    }

    if (discountAmount > totalAmount) {
      discountAmount = totalAmount;
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw createError.BadRequest("This coupon has been used up");
    }

    if (!coupon.status) {
      throw createError.BadRequest("This coupon is not active");
    }

    if (
      coupon.applicableCategoryId &&
      applicableCategoryId !== coupon.applicableCategoryId
    ) {
      throw createError.BadRequest(
        "This coupon is not applicable for this category",
      );
    }
    if (
      coupon.applicableProductId &&
      applicableProductId !== coupon.applicableProductId
    ) {
      throw createError.BadRequest(
        "This coupon is not applicable for this product",
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });

      await tx.order.update({
        where: { id: dto.orderId },
        data: { 
          discount: discountAmount,
          total: new Prisma.Decimal(totalAmount - discountAmount),
        },
      });
    });

    return {
      discountAmount,
      discountType: coupon.discountType,
      finalAmount: totalAmount - discountAmount,
      couponId: coupon.id,
    };
  },
  updateCoupon: async (id: string, dto: CreateCouponDto) => {
    if (!id) throw createError.BadRequest("Coupon ID is required");

    const existingCoupon = await prisma.coupon.findUnique({ where: { id } });
    if (!existingCoupon) throw createError.NotFound("Coupon not found.");

    if (dto.discountType === "PERCENTAGE") {
      if (dto.discountValue < 0 || dto.discountValue > 100) {
        throw createError.BadRequest(
          "For percentage discount, value must be between 0 and 100",
        );
      }
    }

    let couponCode;

    if (dto.code && dto.code !== existingCoupon.code) {
      const randonKey = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      couponCode = `${dto.code}-${randonKey}`;
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: couponCode,
        discountValue: dto.discountValue,
        description: dto.description,
        maxUses: dto.maxUses,
        minOrderValue: dto.minOrderValue,
        discountType: dto.discountType,
        startDate: dto.startDate,
        endDate: dto.endDate,
        applicableCategoryId: dto.applicableCategoryId,
        applicableProductId: dto.applicableProductId,
      },
    });
    if (!updatedCoupon) {
      throw createError.InternalServerError("Coupon not updated!");
    }
    return updatedCoupon;
  },
  deleteCoupon: async (id: string) => {
    if (!id) throw createError.BadRequest("Coupon ID is required");
    const existingCoupon = await prisma.coupon.findUnique({ where: { id } });
    if (!existingCoupon) throw createError.NotFound("Coupon not found");
    await prisma.coupon.delete({ where: { id } });
  },
};

export default couponService;
