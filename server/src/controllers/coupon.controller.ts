import { Request, Response, NextFunction } from "express";
import couponService from "../services/coupon.service.js";
import { success } from "zod";

const couponController = {
  getAllCoupons: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.params.limit) || 10;
      const page = Number(req.params.page) || 1;
      const search = req.query.search as string | undefined;
      const sort = req.query.sort as
        | "code"
        | "discount"
        | "expiryDate"
        | "createdAt"
        | undefined;
      const order = req.query.order as "asc" | "desc" | undefined;
      const coupons = await couponService.getAllCoupons({
        limit,
        page,
        search,
        sort,
        order,
      });
      res.json(coupons);
    } catch (error) {
      next(error);
    }
  },
  getOneCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const coupon = await couponService.getOneCoupon(id);
      res.status(200).json({
        success: true,
        message: "Coupon found successfully",
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  },
  createCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coupon = await couponService.createCoupon(req.body);
      res.status(201).json({
        success: true,
        message: "Coupon created successfully",
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  },
  updateCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const coupon = await couponService.updateCoupon(id, req.body);
      res.status(200).json({
        success: true,
        message: "Coupon updated successfully",
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  },
  applyCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = req.body.code as string;
      const totalAmount = Number(req.body.totalAmount);
      const applicableCategoryId = req.body.applicableCategoryId as
        | string
        | undefined;
      const applicableProductId = req.body.applicableProductId as
        | string
        | undefined;

      const result = await couponService.applyCoupon({
        code,
        totalAmount,
        applicableCategoryId,
        applicableProductId,
      });
      res.status(200).json({
        success: true,
        message: "Coupon applied successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteCoupon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await couponService.deleteCoupon(id);
      res
        .status(200)
        .json({ success: true, message: "Coupon deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default couponController;
