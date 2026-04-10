export interface GetAllOrdersDto {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface GetAllOwnerOrdersDto {
  ownerId?: string;
  cursor?: string;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface CreateOrderDto {
  userId: string;
  cartId: string;
  addressId: string;
}