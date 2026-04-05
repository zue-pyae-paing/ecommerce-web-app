import { NextFunction, Request, Response } from "express";
import cartService from "../services/cart.service.js";

const cartController = {
  getCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const cartId = req.params.id as string;
      const cart = await cartService.getCart(cartId!, userId!);
      res.status(200).json({ success: true, message: "Cart", data: { cart } });
    } catch (error) {
      next(error);
    }
  },
  createCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quantity = req.body.quantity as number;
      const productId = req.params.id as string;
      const userId = req.user?.id as string;
      const cartItem = await cartService.createCart(
        quantity,
        productId,
        userId,
      );
      res
        .status(201)
        .json({
          success: true,
          message: "Cart item added",
          data: { cartItem },
        });
    } catch (error) {
      next(error);
    }
  },
  updateCartItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quantity = req.body.quantity as number;
      const cartItemId = req.params.id as string;
      const userId = req.user?.id as string;
      const cartItem = await cartService.updateCartItem(
        userId,
        cartItemId,
        quantity,
      );
      res
        .status(200)
        .json({
          success: true,
          message: "Cart item updated",
          data: { cartItem },
        });
    } catch (error) {
      next(error);
    }
  },
  deleteCartItem:async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cartItemId = req.params.id as string;
      const userId = req.user?.id as string;
      const cartId = req.params.id as string;
      await cartService.deleteCartItem( cartItemId, userId);
      res.status(200).json({ success: true, message: "Cart item deleted" });
    } catch (error) {
      next(error);
    }
  },
};

export default cartController;
