import { Router } from "express";
import { authMiddleware } from "../middlewares/‌auth.middleware.js";
import userController from "../controllers/user.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { changePasswordSchema, changeUserNameSchema } from "../validations/user.schema.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/profile", userController.getProfile);
router.patch(
  "/change-password",
  validate({ body: changePasswordSchema }),
  userController.changePassword,
);
router.patch("/change-username", validate({body:changeUserNameSchema}), userController.changeUserName);
router.put("/change-avatar", upload.single("avatar"), userController.changeAvatar);
router.delete("/delete", userController.deleteUser);

export default router;
