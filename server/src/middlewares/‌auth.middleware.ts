import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { verifyToken } from "../utils/generateToken";
type UserReq = {
  id: string;
  email: string;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: UserReq;
    }
  }
}
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    throw createError.Unauthorized("Unauthorized");
  }
  const [bearer, token] = authorizationHeader.split(" ");
  if (bearer !== "Bearer") {
    throw createError.Unauthorized("Unauthorized");
  }
  if (!token) {
    throw createError.Unauthorized("Unauthorized");
  }
  try {
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    throw createError.Forbidden("Forbidden");
  }
};
