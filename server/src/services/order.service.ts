import { Prisma } from "../../generated/prisma/index.js";
import { CreateOrderDto, GetAllOrdersDto, GetAllOwnerOrdersDto } from "../dtos/order.dto.js";
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

    const where: Prisma.OrderWhereInput = {
      OR: [
        { user: { userName: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ],
    };
    const [orders, totalOrders] = await prisma.$transaction([
      prisma.order.findMany({ where, orderBy, skip, take: limit }),
      prisma.order.count({ where }),
    ]);

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

    const [orders, totalOrders] = await prisma.$transaction([
      prisma.order.findMany({
        where: { userId: dto.ownerId, ...where },
        orderBy,
        take: limit,
        skip: dto.cursor ? 1 : 0,
        cursor: dto.cursor ? { id: dto.cursor } : undefined,
      }),
      prisma.order.count({
        where: { userId: dto.ownerId, ...where },
      }),
    ]);

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
        payment: true,
      },
    });
    return order;
  },
  createOrder: async (dto:CreateOrderDto) => {
    const { userId, cartId, addressId } = dto;
    if (!cartId) throw createError.BadRequest("Cart ID is required");
    if (!userId) throw createError.BadRequest("User ID is required");
    if (!addressId) throw createError.BadRequest("Address ID is required");
    const cart = await prisma.cart.findUnique({
      where: { id: cartId, userId },
      include: {
        cartItems: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                images: {
                  select: { url: true },
                  orderBy: { id: "asc" },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
    if (!cart) throw createError.NotFound("Cart not found");
    if (cart.userId !== userId)
      throw createError.Unauthorized(
        "You are not authorized to create an order for this cart",
      );
    const cartItems = cart.cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: Number(item.product.price),
    }));
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const orderCode = () => {
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const randomPart = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      return `ORD-${datePart}-${randomPart}`;
    };

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderCode: orderCode(),
          userId,
          total: new Prisma.Decimal(totalAmount),
          deliveryFee: new Prisma.Decimal(0),
          discount: new Prisma.Decimal(0),
          status: "PENDING",
          addressId,
          items: { createMany: { data: cartItems } },
        },
      });
      await tx.cart.delete({ where: { id: cartId } });
      return newOrder;
    });

    return order;
  },
  deleteOrder: async (orderId: string, userId: string) => {
    if (!orderId) throw createError.BadRequest("Order ID is required");
    if (!userId) throw createError.BadRequest("User ID is required");
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw createError.NotFound("Order not found");
    if (order.userId !== userId)
      throw createError.Unauthorized(
        "You are not authorized to delete this order",
      );
    await prisma.order.delete({ where: { id: orderId } });
    return { message: "Order deleted successfully", orderId };
  },
};

export default orderService;
