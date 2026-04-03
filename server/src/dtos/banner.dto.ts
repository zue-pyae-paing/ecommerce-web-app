export interface CreateBannerDto {
  title: string;
  description?: string;
  startDate?: Date;
}



export interface UpdateBannerDto {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  id: string;
}
