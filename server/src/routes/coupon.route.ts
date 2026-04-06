import { Router } from "express";
import couponController from "../controllers/coupon.controller.js";

const router = Router()

router.get("/",couponController.getAllCoupons)
router.get("/:id",couponController.getOneCoupon)
router.post("/",couponController.createCoupon)
router.put("/:id",couponController.updateCoupon)
router.post("/apply",couponController.applyCoupon)
router.delete("/:id",couponController.deleteCoupon)

export default router;