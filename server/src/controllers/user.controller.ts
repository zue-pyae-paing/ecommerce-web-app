import { NextFunction, Request, Response } from "express";
import userServices from "../services/user.service";
import { tr } from "zod/v4/locales";

const userController = {
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      const userProfile = await userServices.getProfile(userId);
      res.status(200).json({
        success: true,
        message: "User profile",
        data: { user: userProfile },
      });
    } catch (error) {
      next(error);
    }
  },
  changeUserName: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      const userName = req.body.userName;
      const user = await userServices.changeUserName(userId, userName);
      res
        .status(200)
        .json({ success: true, message: "User name changed", data: { user } });
    } catch (error) {
      next(error);
    }
  },
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      await userServices.changePassword({ userId, ...req.body });
      res.status(200).json({ success: true, message: "Password changed" });
    } catch (error) {
      next(error);
    }
  },
  changeAvatar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      const file = req.file as Express.Multer.File;
      const user = await userServices.changeAvatar(userId, file);
      res
        .status(200)
        .json({ success: true, message: "Avatar changed", data: { user } });
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      await userServices.deleteOneUser(userId);
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
