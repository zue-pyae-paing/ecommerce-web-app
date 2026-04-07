import { Prisma } from "../../generated/prisma/index.js";
import { GetAllOrdersDto, GetAllOwnerOrdersDto } from "../dtos/order.dto.js";
import { prisma } from "../lib/prisma.js";
import createError from "http-errors";

const orderService = {
  getAllOrders: async (dto: GetAllOrdersDto) => {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const search = dto.search || "";
    const orderBy: Prisma.OrderOrderByWithRelationInput = dto.sort
      ? { [dto.sort]: dto.order }
      : { createdAt: "asc" };

    const skip = (page - 1) * limit;
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { user: { userName: { contains: search, mode: "insensitive" } } },
          { user: { email: { contains: search, mode: "insensitive" } } },
        ],
      },
      orderBy,
      skip,
      take: limit,
    });

    const totalOrders = await prisma.order.count({
      where: {
        OR: [
          { user: { userName: { contains: search, mode: "insensitive" } } },
          { user: { email: { contains: search, mode: "insensitive" } } },
        ],
      },
    });
    const meta = {
      currentPage: page,
      totalPage: Math.ceil(totalOrders / limit),
      totalItems: totalOrders,
      pageSize: limit,
      hasNextPage: page < Math.ceil(totalOrders / limit),
      hasPreviousPage: page > 1,
    };

    return { orders, meta };
  },
  getAllOwnerOrders: async (dto: GetAllOwnerOrdersDto) => {
    const limit = dto.limit || 10;
    const where: Prisma.OrderWhereInput = dto.search
      ? {
          orderCode: { contains: dto.search, mode: "insensitive" },
        }
      : {};
    const orderBy: Prisma.OrderOrderByWithRelationInput = dto.sort
      ? { [dto.sort]: dto.order }
      : { createdAt: "asc" };

    const orders = await prisma.order.findMany({
      where: {
        userId: dto.ownerId,
        ...where,
      },
      orderBy,
      take: limit,
      cursor: dto.cursor ? { id: dto.cursor } : undefined,
    });

    const totalOrders = await prisma.order.count({
      where: {
        userId: dto.ownerId,
        ...where,
      },
    });
    const meta = {
      totalPage: Math.ceil(totalOrders / limit),
      totalItems: totalOrders,
      pageSize: limit,
      hasNextPage: orders.length === limit,
      hasPreviousPage: !!dto.cursor,
    };

    return { orders, meta };
  },
  getOneOrder: async (orderId: string) => {
    if (!orderId) throw createError.BadRequest("Order ID is required");
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, userName: true, email: true } },
        items: {
          include: { product: { select: { title: true, price: true } } },
        },
        address: true,
      },
    });
    return order;
  },
  createOrder: async (orderData: any) => {},
  updateOrder: async (orderId: string, orderData: any) => {},
  deleteOrder: async (orderId: string) => {},
};

export default orderService;
