import { Request, Response, NextFunction } from "express";
import orderService from "../services/order.service.js";
import createError from "http-errors";

const orderController = {
  getAllOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.params.page) || 1;
      const limit = Number(req.params.limit) || 10;
      const search = req.params.search as string | undefined;
      const sort = req.params.sort as string | undefined;
      const order = req.params.order as "asc" | "desc" | undefined;
      const {orders,meta} = await orderService.getAllOrders({
        page,
        limit,
        search,
        sort,
        order,
      });
      res.status(200).json({ success: true, message: "Orders", data: {orders,meta} });
    } catch (error) {
      next(error);
    }
  },
  getAllOwnerOrders:async (req: Request, res: Response, next: NextFunction) => {
    try {
      if(!req.user) throw createError.Unauthorized("User not found in request");
      const ownerId = req.user.id as string ;
      const cursor = req.params.cursor as string | undefined;
      const limit = Number(req.params.limit) || 10;
      const search = req.params.search as string | undefined;
      const sort = req.params.sort as string | undefined;
      const order = req.params.order as "asc" | "desc" | undefined;
      const {orders,meta} = await orderService.getAllOwnerOrders({
        ownerId,
        cursor,
        limit,
        search,
        sort,
        order,
      });
      res.status(200).json({ success: true, message: "Owner Orders", data: {orders,meta} });
    } catch (error) {
      next(error);
    }
  },
  getOneOrder:async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.id as string;
      const order = await orderService.getOneOrder(orderId);
      res.status(200).json({ success: true, message: "Order Details", data: order });
    } catch (error) {
      next(error);
    }
  },
  createOrder: async(req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw createError.Unauthorized("User not found in request");
      const userId = req.user.id as string;
      const cartId = req.params.id as string;
      const {  addressId } = req.body;
      const order = await orderService.createOrder({ userId, cartId, addressId });
      res.status(201).json({ success: true, message: "Order Created", data: order });
    } catch (error) {
      next(error);
    }
  },
  deleteOrder:async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw createError.Unauthorized("User not found in request");
      const orderId = req.params.id as string;
      const userId =req.user.id as string
      await orderService.deleteOrder(orderId,userId);
      res.status(200).json({ success: true, message: "Order Deleted" });
    } catch (error) {
      next(error);
    }
  },
};

export default orderController;
