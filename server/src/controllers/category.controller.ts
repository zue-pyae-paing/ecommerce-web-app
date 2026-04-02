import { Request, Response, NextFunction } from "express";
import categoryService from "../services/category.service";

const categoryController = {
  getAllCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json({
        success: true,
        message: "All categories",
        data: { categories },
      });
    } catch (error) {
      next(error);
    }
  },
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await categoryService.createCategory(req.body);
      res
        .status(201)
        .json({
          success: true,
          message: "Category created",
          data: { category },
        });
    } catch (error) {
      next(error);
    }
  },
  getOneCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const category = await categoryService.getOneCategory(id);
      res
        .status(200)
        .json({ success: true, message: "Category", data: { category } });
    } catch (error) {
      next(error);
    }
  },
  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const category = await categoryService.updateCategory({id, ...req.body});
      res.status(200).json({ success: true, message: "Category updated", data: { category } });
    } catch (error) {
      next(error);
    }
  },
  deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await categoryService.deleteCategory(id);
      res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
      next(error);
    }
  },
};

export default categoryController;
