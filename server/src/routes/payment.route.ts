import { Router } from "express";
import paymentController from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/‌auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  createPaymentSchema,
  paymentParamIdSchema,
} from "../validations/payment.schema.js";

const router = Router();
router.use(authMiddleware);

router.get("/", adminMiddleware, paymentController.getAllPayments);
router.get("/me", paymentController.getUserPayments);
router.get(
  "/:id",
  validate({ params: paymentParamIdSchema }),
  paymentController.getPaymentById,
);
router.post(
  "/",
  adminMiddleware,
  validate({ body: createPaymentSchema }),
  paymentController.createPayment,
);
router.patch(
  "/:id",
  adminMiddleware,
  validate({ params: paymentParamIdSchema }),
  paymentController.updatePaymentStatus,
);

export default router;
