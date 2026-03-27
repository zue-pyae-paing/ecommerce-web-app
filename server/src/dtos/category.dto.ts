export interface CreateCategoryDto {
  name: string;
  description?: string;
  status?: boolean;
}

export interface UpdateCategoryDto {
  id: string;
  name?: string;
  description?: string;
  status?: boolean;
}