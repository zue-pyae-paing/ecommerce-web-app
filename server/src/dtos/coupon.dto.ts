export interface GetAllCouponDto {
  limit?: number;
  page?: number;
  search?: string;
  sort?: "code" | "discount" | "expiryDate" | "createdAt";
  order?: "asc" | "desc";
}

export interface CreateCouponDto {
  code: string;
  discountValue: number;
  description?: string;
  maxUses: number;
  minOrderValue: number;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  startDate: Date;
  endDate: Date;
  applicableCategoryId?: string;
  applicableProductId?: string;
}

export interface ApplyCouponDto {
  code: string;
  totalAmount: number;
  orderId: string;
  applicableProductId?: string;
  applicableCategoryId?: string;
}