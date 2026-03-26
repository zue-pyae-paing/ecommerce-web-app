import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";

interface ValidateOptions {
  body?: ZodObject<any>;
  params?: ZodObject<any>;
}
export const validate =
  (schema: ValidateOptions) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        schema.body.parse(req.body);
      }
      if (schema.params) {
        schema.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          errors: error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
            code: i.code,
          })),
        });
      }
      next(error);
    }
  };
