import { CreateBannerDto, UpdateBannerDto } from "../dtos/banner.dto";
import createError from "http-errors";
import { prisma } from "../lib/prisma";
import { imageKit } from "../utils/imageKit";

const bannerService = {
  getBanner: async () => {
    const banner = await prisma.banner.findFirst();
    if (!banner) {
      throw createError.NotFound("Banner not found");
    }
    return banner;
  },
  createBanner: async (dto: CreateBannerDto, file: Express.Multer.File) => {
    let uploadImageResult: { imageUrl: string; publicId: string };
    try {
      const result = await imageKit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: "banners",
      });
      uploadImageResult = {
        imageUrl: result.url,
        publicId: result.fileId,
      };
    } catch (error) {
      throw createError.InternalServerError("Failed to upload image");
    }

    const banner = await prisma.banner.create({
      data: {
        ...dto,
        imageUrl: uploadImageResult.imageUrl,
        publicId: uploadImageResult.publicId,
      },
    });
    return banner;
  },
  updateBanner: async (dto:UpdateBannerDto) => {
    const existingBanner = await prisma.banner.findUnique({ where: { id: dto.id } });
    if (!existingBanner) {
      throw createError.NotFound("Banner not found");
    }
    const banner = await prisma.banner.update({
      where: { id: dto.id },
      data: { ...dto },
    });
    return banner;
  },
  deleteBanner: async (id: string) => {
    const existingBanner = await prisma.banner.findUnique({ where: { id } });
    if (!existingBanner) {
      throw createError.NotFound("Banner not found");
    }
    await prisma.banner.delete({ where: { id } });
  },
};

export default bannerService;
