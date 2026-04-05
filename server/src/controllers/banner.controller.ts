import { NextFunction, Request, Response } from "express";
import bannerService from "../services/banner.service.js";

const bannerController = {
  getBanner: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const banner = await bannerService.getBanner();
      res.status(200).json({ success: true, message: "Banner", data: banner });
    } catch (error) {
      next(error);
    }
  },
  createBanner: async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file as Express.Multer.File;
    try {
        const banner = await bannerService.createBanner(req.body, file);
        res.status(201).json({
          success: true,
          message: "Banner created successfully",
          data: banner,
        });
    } catch (error) {
      next(error);
    }
  },
  updateBanner: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const file = req.file as Express.Multer.File;
        const banner = await bannerService.updateBanner({ ...req.body, id },file);
        res.status(200).json({
          success: true,
          message: "Banner updated successfully",
          data: banner,
        });
    } catch (error) {
      next(error);
    }
  },
  deleteBanner: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string
        await bannerService.deleteBanner(id);
        res.status(200).json({
          success: true,
          message: "Banner deleted successfully",
        });
    } catch (error) {
      next(error);
    }
  },
};

export default bannerController;
