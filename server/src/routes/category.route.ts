import { Router } from "express";
import { authMiddleware } from "../middlewares/‌auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import categoryController from "../controllers/category.controller";
import { validate } from "../middlewares/validation.middleware";
import { categorySchema, paramsSchema } from "../validations/category.schema";

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
