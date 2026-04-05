import { Router } from "express";
import { authMiddleware } from "../middlewares/‌auth.middleware.js";
import cartController from "../controllers/cart.controller.js";

const router = Router()


router.use(authMiddleware)

router.get("/:id",cartController.getCart)
router.post("/:id",cartController.createCart)
router.put("/:id",cartController.updateCartItem)
router.delete("/:id",cartController.deleteCartItem)


export default router