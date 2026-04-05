import { Router } from "express";
import { authMiddleware } from "../middlewares/‌auth.middleware.js";
import productController from "../controllers/product.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  createProductSchema,
  productIdParamSchema,
} from "../validations/product.schema.js";

const router = Router();

router.use(authMiddleware);

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getOneProduct);
router.post(
  "/",
  upload.array("images", 5),
  validate({ body: createProductSchema }),
  productController.createProduct,
);
router.put(
  "/:id",
  upload.array("images", 5),
  validate({ body: createProductSchema, params: productIdParamSchema }),
  productController.updateProduct,
);
router.delete(
  "/:id",
  validate({ params: productIdParamSchema }),
  productController.deleteProduct,
);

export default router;
