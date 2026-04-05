import createError from "http-errors";
import { prisma } from "../lib/prisma.js";

const cartService = {
  getCart: async (id: string, userId: string) => {
    if (!id) throw createError.BadRequest("Cart id not found");

    const cart = await prisma.cart.findUnique({
      where: { id, userId },
      include: {
        cartItems: {
          include: {
            product: {
              select: {
                title: true,
                description: true,
                stock: true,
                images: {
                  orderBy: { id: "asc" },
                  take: 1,
                  select: { url: true },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) throw createError.NotFound("Cart not found!");
    if (cart.userId !== userId)
      throw createError.Unauthorized("Unauthorized access to cart!");

    const formattedCartItems = cart.cartItems.map((item) => ({
      ...item,
      price: item.price.toNumber(),
    }));

    const subTotal = formattedCartItems.reduce((total, item) => {
      return total + item.price;
    }, 0);

    const totalCount = formattedCartItems.length;

    return { ...cart, cartItems: formattedCartItems, subTotal, totalCount };
  },
  createCart: async (quantity: number, productId: string, userId: string) => {
    if (!quantity || quantity <= 0 || !productId)
      throw createError.BadRequest("Quantity and productId are required");
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });
      if (!product) throw createError.NotFound("Product not found!");
      const cart = await tx.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });
      const existingCartItem = await tx.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      });

      const newQuantity = existingCartItem
        ? existingCartItem.quantity + quantity
        : quantity;

      if (product.stock < newQuantity) {
        throw createError.BadRequest(
          `Insufficient stock. Available stock: ${product.stock}`,
        );
      }

      const cartItem = await tx.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId } },
        update: {
          quantity: newQuantity,
          price: product.price.mul(newQuantity),
        },
        create: {
          cartId: cart.id,
          productId,
          price: product.price.mul(newQuantity),
          quantity: newQuantity,
        },
        include: {
          product: {
            select: {
              title: true,
              description: true,
              stock: true,
              images: {
                orderBy: { id: "asc" },
                take: 1,
                select: { url: true },
              },
            },
          },
        },
      });
      return cartItem;
    });
    return result;
  },
  updateCartItem: async (
    userId: string,
    cartItemId: string,
    quantity: number,
  ) => {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true, product: true },
    });
    if (!cartItem) throw createError.NotFound("Cart item not found!");

    if (cartItem.cart.userId !== userId)
      throw createError.Unauthorized("Unauthorized access to cart item!");

    const sotck = cartItem.product.stock ?? 0;
    if (quantity > sotck) {
      throw createError.BadRequest(
        `Insufficient stock. Available stock: ${sotck}`,
      );
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
      return null;
    }
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity,
        price: cartItem.product.price.mul(quantity),
      },
      include: {
        product: {
          select: {
            title: true,
            description: true,
            stock: true,
            images: {
              orderBy: { id: "asc" },
              take: 1,
              select: { url: true },
            },
          },
        },
      },
    });
    return updatedCartItem;
  },
  deleteCartItem: async (cartItemId: string, userId: string) => {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });
    
    if (!cartItem) throw createError.NotFound("Cart item not found!");

    if (cartItem.cart.userId !== userId)
      throw createError.Unauthorized("Unauthorized access to cart item!");

    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return null;
  },
};

export default cartService;
