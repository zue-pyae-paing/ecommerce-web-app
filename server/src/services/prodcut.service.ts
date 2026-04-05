import { Prisma } from "../../generated/prisma/index.js";

import {
  CreateProductDto,
  GetAllProductDto,
  UpdateProductDto,
} from "../dtos/product.dto.js";
import { prisma } from "../lib/prisma.js";
import { imageKit } from "../utils/imageKit.js";
import createError from "http-errors";

const productServices = {
  getAllProducts: async (dto: GetAllProductDto) => {
    const limit = dto.limit ?? 10;
    const orderBy: Prisma.ProductOrderByWithRelationInput = dto.sort
      ? { [dto.sort]: dto.order }
      : { createdAt: "desc" };

    let where: Prisma.ProductWhereInput = {};
    if (dto.search) {
      where.OR = [
        { title: { contains: dto.search, mode: "insensitive" } },
        { description: { contains: dto.search, mode: "insensitive" } },
      ];
    }
    const products = await prisma.product.findMany({
      where: { ...where },
      include: {
        category: { select: { name: true } },
        images: { select: { url: true, publicId: true } },
      },
      orderBy,
      take: limit,
      skip: dto.cursor ? 1 : 0,
      cursor: dto.cursor ? { id: dto.cursor } : undefined,
    });

    const fromattedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price),
    }));

    const nextCursor =
      products.length > limit ? products[products.length - 1].id : null;
    const totlalCount = await prisma.product.count({ where });
    const meta = {
      nextCursor,
      hasMore: nextCursor ? true : false,
      total: totlalCount,
    };
    return { products: fromattedProducts, meta };
  },
  getOneProduct: async (productId: string) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: { select: { name: true } },
        images: { select: { url: true, publicId: true } },
      },
    });
    return product;
  },
  createProduct: async (
    dto: CreateProductDto,
    files: Express.Multer.File[],
  ) => {
    const category = await prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw createError.BadRequest("Invalid category ID");
    }
    const productSlug = dto.title.toLowerCase().replace(/\s+/g, "-");
    if (files.length > 5) {
      throw createError.BadRequest("You can upload up to 5 images");
    }

    const uploadImages = await Promise.all(
      files.map((file) => {
        try {
          return imageKit.upload({
            file: file.buffer.toString("base64"),
            fileName: file.originalname,
            folder: "products",
          });
        } catch (error) {
          throw createError.InternalServerError("Image cloud server error!");
        }
      }),
    );
    const successIamgesUpladed = uploadImages.filter(Boolean);

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          title: dto.title,
          description: dto.description,
          price: Number(dto.price),
          stock: Number(dto.stock),
          category: { connect: { id: dto.categoryId } },
        },
      });
      if (successIamgesUpladed.length > 0) {
        await tx.productImage.createMany({
          data: successIamgesUpladed.map((img) => ({
            url: img.url,
            publicId: img.fileId,
            productId: product.id,
          })),
        });
      }
      return product;
    });
    return result;
  },
  updateProduct: async (
    dto: UpdateProductDto,
    files: Express.Multer.File[],
  ) => {
    const existingProduct = await prisma.product.findUnique({
      where: { id: dto.id },
      include: { images: true },
    });
    if (!existingProduct) {
      throw createError.NotFound("Product not found");
    }

    const deleteImagePublicIds: string[] = Array.isArray(dto.deletedImageIds)
      ? dto.deletedImageIds
      : dto.deletedImageIds
        ? [dto.deletedImageIds]
        : [];

    const remainingImages =
      existingProduct.images.length - deleteImagePublicIds.length;

    if (files.length + remainingImages > 5) {
      throw createError.BadRequest("Maximum 5 images allowed per product");
    }

    let uploadedImages: { url: string; publicId: string }[] = [];
    try {
      uploadedImages = await Promise.all(
        files.map(async (file) => {
          const uploadResult = await imageKit.upload({
            file: file.buffer.toString("base64"),
            fileName: file.originalname,
            folder: "products",
          });
          return { url: uploadResult.url, publicId: uploadResult.fileId };
        }),
      );
    } catch (error) {
      throw createError.InternalServerError("Image upload failed");
    }

    let result;
    try {
      result = await prisma.$transaction(async (tx) => {
        const { categoryId, deletedImageIds, ...rest } = dto;

        const product = await tx.product.update({
          where: { id: dto.id },
          data: {
            ...rest,
            ...(categoryId
              ? { category: { connect: { id: categoryId } } }
              : {}),
          },
          include: { category: true, images: true }, // ✅ include relations
        });

        if (deleteImagePublicIds.length > 0) {
          await tx.productImage.deleteMany({
            where: {
              productId: dto.id,
              publicId: { in: deleteImagePublicIds },
            },
          });
        }

        if (uploadedImages.length > 0) {
          await tx.productImage.createMany({
            data: uploadedImages.map((img) => ({
              url: img.url,
              publicId: img.publicId,
              productId: product.id,
            })),
          });
        }

        // ✅ Return product again with fresh relations after changes
        return tx.product.findUnique({
          where: { id: dto.id },
          include: { category: true, images: true },
        });
      });
    } catch (err) {
      // Cleanup uploaded images if transaction fails
      if (uploadedImages.length > 0) {
        await Promise.allSettled(
          uploadedImages.map((img) => imageKit.deleteFile(img.publicId)),
        );
      }
      throw err;
    }

    // Delete old images from ImageKit after DB success
    if (deleteImagePublicIds.length > 0) {
      const imagesToDelete = existingProduct.images.filter((img) =>
        deleteImagePublicIds.includes(img.publicId),
      );
      await Promise.allSettled(
        imagesToDelete.map((img) => imageKit.deleteFile(img.publicId)),
      );
    }

    return result; // ✅ return updated product with category + images
  },
  deleteProduct: async (productId: string) => {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });
    if (!existingProduct) {
      throw createError.NotFound("Product not found");
    }

    for (const image of existingProduct.images) {
      try {
        await imageKit.deleteFile(image.publicId);
      } catch (error) {
        throw createError.InternalServerError("Image cloud server error!");
      }
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });
    return deletedProduct;
  },
};

export default productServices;
