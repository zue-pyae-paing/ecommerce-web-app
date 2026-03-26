import jwt from "jsonwebtoken";
import createError from "http-errors";


interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export const generateAccessToken = (user: UserPayload): string => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "2h" },
  );
  return accessToken;
};

export const generateRefreshToken = (user: UserPayload): string => {
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );
  return refreshToken;
};

export const verifyToken = (toke: string) => {
  try {
    const decoded = jwt.verify(toke, process.env.JWT_SECRET!);
    return decoded as UserPayload;
  } catch (error) {
    throw new createError.Unauthorized("Invalid Token!")
  }
};
