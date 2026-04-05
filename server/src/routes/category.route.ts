import { Router } from "express";
import { authMiddleware } from "../middlewares/‌auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import categoryController from "../controllers/category.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { categorySchema, paramsSchema } from "../validations/category.schema.js";

const router = Router();

router.use(authMiddleware);

router.get("/", categoryController.getAllCategories);
router.get(
  "/:id",
  validate({ params: paramsSchema }),
  categoryController.getOneCategory,
);
router.post(
  "/",
  adminMiddleware,
  validate({ body: categorySchema }),
  categoryController.createCategory,
);
router.put(
  "/:id",
  adminMiddleware,
  validate({ params: paramsSchema, body: categorySchema }),
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  adminMiddleware,
  validate({ params: paramsSchema }),
  categoryController.deleteCategory,
);

export default router;
