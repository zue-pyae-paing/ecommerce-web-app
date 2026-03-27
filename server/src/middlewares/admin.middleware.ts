import crateError from "http-errors";
import { NextFunction, Request, Response } from "express";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user?.role !== "Admin") {
      throw crateError.Forbidden("Forbidden");
    }
    next();
  } catch (error) {
    next(error);
  }
};
