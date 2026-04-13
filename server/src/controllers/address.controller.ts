import { Request, Response, NextFunction } from "express";
import addressService from "../services/address.service.js";

const addressController = {
  async getAllAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await addressService.getAllAddress(req.query);
      res.status(200).json({
        success: true,
        message: "Address fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getOneAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const result = await addressService.getOneAddress(id);
      res.status(200).json({
        success: true,
        message: "Address fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async createAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await addressService.createAddress(req.body);
      res.status(201).json({
        success: true,
        message: "Address created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const result = await addressService.deleteAddress(id);
      res.status(200).json({
        success: true,
        message: "Address deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default addressController;