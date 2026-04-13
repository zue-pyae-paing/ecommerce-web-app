import { Request, Response, NextFunction } from "express";
import deliveryFeeService from "../services/deliveryFee.service.js";
import { success } from "zod";

const deliveryFeeController = {
  getAllDeliveryFees: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const deliveryFees = await deliveryFeeService.getAllDeliveryFees();
      res.status(200).json({
        success: true,
        message: "Delivery Fees fetched successfully",
        data: deliveryFees,
      });
    } catch (error) {
      next(error);
    }
  },
  getOneDeliveryFee: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params as { id: string };
      const deliveryFee = await deliveryFeeService.getOneDeliveryFee(id);
      res.status(200).json({
        success: true,
        message: "Delivery Fee fetched successfully",
        data: deliveryFee,
      });
    } catch (error) {
      next(error);
    }
  },
  createDeliveryFee: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const deliveryFee = await deliveryFeeService.createDeliveryFee(req.body);
      res.status(201).json({
        success: true,
        message: "Delivery Fee created successfully",
        data: deliveryFee,
      });
    } catch (error) {
      next(error);
    }
  },
  updateDeliveryFee: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params as { id: string };
      const deliveryFee = await deliveryFeeService.updateDeliveryFee(
        id,
        req.body,
      );
      res.status(200).json({
        success: true,
        message: "Delivery Fee updated successfully",
        data: deliveryFee,
      });
    } catch (error) {
      next(error);
    }
  },
  applyDeliveryFee: async (req: Request, res: Response, next: NextFunction) => {
    try {
     const id = req.params.id as string;
     const orderId = req.body.orderId as string;
     const deliveryFee = await deliveryFeeService.applyDeliveryFee(orderId, id);
      res.status(200).json({
        success: true,
        message: "Delivery Fee applied successfully",
        data: deliveryFee,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteDeliveryFee: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params as { id: string };
      const deliveryFee = await deliveryFeeService.deleteDeliveryFee(id);
      res.status(200).json({
        success: true,
        message: "Delivery Fee deleted successfully",
        data: deliveryFee,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default deliveryFeeController;
