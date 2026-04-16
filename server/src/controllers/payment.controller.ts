import { Request, Response, NextFunction } from "express";
import paymentService from "../services/payment.service.js";
import { success } from "zod";

const paymentController = {
  getAllPayments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const search = req.query.search as string | undefined;
      const sort = req.query.sort as
        | "transactionId"
        | "amount"
        | "createdAt"
        | undefined;
      const order = req.query.order as "asc" | "desc" | undefined;
      const result = await paymentService.getAllPayments({
        page,
        search,
        sort,
        order,
        limit,
      });
      res.status(200).json({ success: true, message:"", data: result });
    } catch (error) {
      next(error);
    }
  },

  getUserPayments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const limit = parseInt(req.query.limit as string) || 10;
      const cursor = req.query.cursor as string | "";
      const search = req.query.search as string | undefined;
      const sort = req.query.sort as
        | "transactionId"
        | "amount"
        | "createdAt"
        | undefined;
      const order = req.query.order as "asc" | "desc" | undefined;

      const result = await paymentService.getUserPayments({
        userId,
        cursor,
        search,
        sort,
        order,
        limit,
      });

      res.status(200).json({ success:true, message:"",data: result });
    } catch (error) {
      next(error);
    }
  },

  getPaymentById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      const result = await paymentService.getPaymentById(id);

      res.status(200).json({ success:true,message:"Payment details",data: result });
    } catch (error) {
      next(error);
    }
  },

  createPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, method, senderPhone, transactionId } = req.body;
      const result = await paymentService.createPayment({
        orderId,
        method,
        senderPhone,
        transactionId,
      });

      res.status(201).json({
        success: true,
        message: "Payment initiated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  updatePaymentStatus: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params as { id: string };
      const { status } = req.body;
      const result = await paymentService.updatePaymentStatus(id, status);
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  },
};

export default paymentController;
