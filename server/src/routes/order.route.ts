import { Router } from "express";

import orderController from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/‌auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", orderController.getAllOrders);
router.get("/owner", orderController.getAllOwnerOrders);
router.get("/:id", orderController.getOneOrder);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

export default router