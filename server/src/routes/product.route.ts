import { Router } from "express";
import { authMiddleware } from "../middlewares/‌auth.middleware";
import productController from "../controllers/product.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.use(authMiddleware)

router.get("/", productController.getAllProducts );
router.get("/:id", productController.getOneProduct);
router.post("/", upload.array("images", 5), productController.createProduct);
router.put("/:id",upload.array("images", 5), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;