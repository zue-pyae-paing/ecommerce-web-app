import { Prisma } from "../../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";
import createError from "http-errors";
import { CreateAddressDto, GetAllAddressDto } from "../dtos/address.dto.js";

const addressService = {
  async getAllAddress(dto: GetAllAddressDto) {
    const limit = dto.limit ?? 10;
    const cursor = dto.cursor;
    if (limit <= 0 || limit > 100) {
      throw createError.BadRequest("Limit must be between 1 and 100");
    }

    const allowedSortFields = ["createdAt", "updatedAt"] as const;

    if (dto.sort && !allowedSortFields.includes(dto.sort as any)) {
      throw createError.BadRequest("Invalid sort field");
    }

    const orderBy: Prisma.AddressOrderByWithRelationInput = dto.sort
      ? { [dto.sort]: dto.order ?? "desc" }
      : { createdAt: "desc" };

    const addresses = await prisma.address.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy,
    });

    const nextCursor =
      addresses.length === limit
        ? addresses[addresses.length - 1].id
        : null;

    return {
      data: addresses,
      meta: {
        limit,
        nextCursor,
        hasNextPage: Boolean(nextCursor),
      },
    };
  },

  async getOneAddress(id: string) {
    if (!id) {
      throw createError.BadRequest("Address ID is required");
    }

    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw createError.NotFound("Address not found");
    }

    return {
      data: address,
    };
  },

  async createAddress(dto: CreateAddressDto) {
    if (!dto) {
      throw createError.BadRequest("Address data is required");
    }

    const address = await prisma.address.create({
      data: dto,
    });

    return {
      data: address,
      message: "Address created successfully",
    };
  },

  async deleteAddress(id: string) {
    if (!id) {
      throw createError.BadRequest("Address ID is required");
    }

    await prisma.address.delete({
      where: { id },
    });

    return {
      message: "Address deleted successfully",
    };
  },
};

export default addressService;