import { Router } from "express";
import authControllers from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validations/user.schema";
const router = Router();

router.post(
  "/register",
  validate({ body: registerSchema }),
  authControllers.register,
);

router.post("/login", validate({ body: loginSchema }), authControllers.login);

router.post(
  "/forgot-password",
  validate({ body: forgotPasswordSchema }),
  authControllers.forgotPassword,
);

router.put(
  "/reset-password/:token",
  validate({ body: resetPasswordSchema }),
  authControllers.resetPassword,
);

router.post("/refresh-token", authControllers.refreshToken);

export default router;
