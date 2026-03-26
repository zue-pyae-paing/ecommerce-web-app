import { ChangePasswordDto } from "../dtos/user.dto";
import { prisma } from "../lib/prisma";
import createError from "http-errors";
import bcrypt from "bcryptjs";
import { imageKit } from "../utils/imageKit";

const userServices = {
  getProfile: async (usreId: string) => {
    if (!usreId) throw createError.BadRequest("User id not found");
    const user = await prisma.user.findUnique({
      where: { id: usreId },
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
        avatar: true,
        publicId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw createError.NotFound("User not found!");
    return user;
  },
  changeUserName: async (userId: string, userName: string) => {
    if(!userId) throw createError.BadRequest("User id not found");
    const existingUser = await prisma.user.findUnique({ where: { id:userId } });
    if(!existingUser) throw createError.NotFound("User not found!");
    return await prisma.user.update({
      where: { id: userId },
      data: { userName },
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
        avatar: true,
        publicId: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  },
  changePassword: async (dto: ChangePasswordDto) => {
    if (!dto.userId) throw createError.BadRequest("User id not found");
    const existingUser = await prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!existingUser) throw createError.NotFound("User not found!");
    const isMatch = await bcrypt.compare(
      dto.oldPassword,
      existingUser.password,
    );
    if (!isMatch) throw createError.BadRequest("Old password is incorrect!");
    const newPassword = await bcrypt.hash(dto.newPassword, 10);
    return await prisma.user.update({
      where: { id: dto.userId },
      data: { password: newPassword },
    });
  },
  changeAvatar: async (userId: string, file: Express.Multer.File) => {
    if (!userId) throw createError.BadRequest("User id not found");
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) throw createError.NotFound("User not found!");
    if (existingUser.publicId)
      try {
        await imageKit.deleteFile(existingUser.publicId);
      } catch (error) {
        throw createError.InternalServerError("Image cloud server error!");
      }
    let uploadImage;
    try {
      uploadImage = await imageKit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: "avatars",
      });
    } catch (error) {
      throw createError.InternalServerError("Image upload failed!");
    }
    return await prisma.user.update({
      where: { id: userId },
      data: { avatar: uploadImage.url, publicId: uploadImage.fileId },
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
        avatar: true,
        publicId: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  },
  deleteOneUser: async (id: string) => {
    if (!id) throw createError.BadRequest("User id not found");
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) throw createError.NotFound("User not found!");
    if (existingUser.publicId)
      try {
        await imageKit.deleteFile(existingUser.publicId);
      } catch (error) {
        throw createError.InternalServerError("Image cloud server error!");
      }
    const user = await prisma.user.delete({ where: { id } });
    return user;
  },
};

export default userServices;
