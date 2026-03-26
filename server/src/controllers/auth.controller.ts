import { Request, Response, NextFunction } from "express";
import authServices from "../services/auth.service";
import { sendMail } from "../utils/sendMail";
import { success } from "zod";
import { ref } from "process";

const authControllers = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authServices.retister(req.body);
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken, user } = await authServices.login(
        req.body,
      );
      res.status(200).json({
        success: true,
        message: `${user.userName} logged in successfully`,
        data: { accessToken, refreshToken, user },
      });
    } catch (error) {
      next(error);
    }
  },
  forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { resetToken } = await authServices.forgotPassword(req.body.email);
      const link = `${req.protocol}://${req.host}/api/v1/auth/reset-password/${resetToken}`;
      await sendMail(req.body.email, "Password Reset Link", link);
      res.status(200).json({
        success: true,
        message: "Password reset link has been sent to your email",
      });
    } catch (error) {
      next(error);
    }
  },
  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.params.token as string;
      const newPassword = req.body.newPassword;
      await authServices.resetPassword({ token, newPassword });
      res
        .status(200)
        .json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      next(error);
    }
  },
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken } = await authServices.refreshToken(req.body.token);
      res
        .status(200)
        .json({
          success: true,
          message: "Token refreshed successfully",
          data: { accessToken },
        });
    } catch (error) {
      next(error);
    }
  },
};

export default authControllers;
