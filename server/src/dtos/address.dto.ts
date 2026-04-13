export interface GetAllAddressDto {
  cursor?: string;
  limit?: number;
  search?: string;
  sort?: "region" | "phoneNumber" | "createdAt";
  order?: "asc" | "desc";
}

export interface CreateAddressDto {
  userId: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode?: string;
  isDefault?: boolean;
}