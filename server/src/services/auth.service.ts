import createError from "http-errors";
import {
  LoginUserDto,
  RegisterUserDto,
  ResetPassword,
  Role,
} from "../dtos/auth.dto";
import { prisma } from "../lib/prisma";
import * as bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import crypto from "crypto";
const authServices = {
  retister: async (dto: RegisterUserDto) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw createError.Conflict("User already exists");
    const isAdmin = dto.email === "admin@gmail.com";
    if (isAdmin) {
      dto.role = Role.ADMIN;
    } else {
      dto.role = Role.USER;
    }

    const hashPassword = await bcrypt.hash(dto.password, 10);
    return await prisma.user.create({
      data: {
        userName: dto.userName,
        email: dto.email,
        password: hashPassword,
        role: dto.role,
      },
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
      },
    });
  },
  login: async (dto: LoginUserDto) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!existingUser) throw createError.NotFound("User not found!");
    const isMatch = await bcrypt.compare(dto.password, existingUser.password);
    if (!isMatch) throw createError.Unauthorized("Invalid credentials!");
    const accessToken = generateAccessToken({
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    });
    const refreshToken = generateRefreshToken({
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    });
    const updateUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: { refreshToken: refreshToken },
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
      },
    });
    return { accessToken, refreshToken, user: updateUser };
  },
  forgotPassword: async (email: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) throw createError.NotFound("User Not found!");
    const resetToken = crypto.createHash("sha256").update(email).digest("hex");
    const expireTime = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { resetToken: resetToken, resetTokenExpire: expireTime },
    });
    return { resetToken };
  },
  resetPassword: async (dto: ResetPassword) => {
    if (!dto.token) throw createError.BadRequest("Token not found");
    const existingUser = await prisma.user.findFirst({
      where: { resetToken: dto.token, resetTokenExpire: { gt: new Date() } },
    });
    if (!existingUser) throw createError.NotFound("User Not found!");
    const newPassword = await bcrypt.hash(dto.newPassword, 10);
    return await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: newPassword, resetToken: null, resetTokenExpire: null },
    });
  },
};

export default authServices;
