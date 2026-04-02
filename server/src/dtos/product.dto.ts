export interface GetAllProductDto {
  cursor?: string;
  limit?: number;
  search?: string;
  sort?: "title" | "price" | "createdAt";
  order?: "asc" | "desc";
}

export interface CreateProductDto {
  categoryId: string;
  title: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProductDto {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  deletedImageIds?: string[];
}
