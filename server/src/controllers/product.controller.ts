import { NextFunction, Request, Response } from "express";
import productServices from "../services/prodcut.service";
import { asyncWrapProviders } from "node:async_hooks";

const productController = {
  getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const cursor = req.query.cursor as string | "";
      const search = req.query.search as string | undefined;
      const sort = req.query.sort as
        | "title"
        | "price"
        | "createdAt"
        | undefined;
      const order = req.query.order as "asc" | "desc" | undefined;

      const products = await productServices.getAllProducts({
        cursor,
        search,
        sort,
        order,
        limit,
      });
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  },
  getOneProduct: (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id as string;
      const product = productServices.getOneProduct(productId);
      res.status(200).json({
        success: true,
        message: "Product found successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },
  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      const product = await productServices.createProduct(req.body, files);
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },
  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id as string;
      const data = {
        ...req.body,
        price: req.body.price ? Number(req.body.price) : undefined,
        stock: req.body.stock ? Number(req.body.stock) : undefined,
      };

      const files = (req.files as Express.Multer.File[]) || [];
      const updatedProduct = await productServices.updateProduct(
        { ...data, id: productId },
        files,
      );
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteProduct: (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id as string;
      const deletedProduct = productServices.deleteProduct(productId);
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default productController;
