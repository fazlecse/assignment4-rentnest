export interface ICreatePropertyPayload {
  title: string;
  description: string;
  address: string;
  city: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  categoryId: string;
  thumbnail?: string;
}

export interface IUpdatePropertyPayload {
  title?: string;
  description?: string;
  address?: string;
  city?: string;
  rent?: number;
  bedrooms?: number;
  bathrooms?: number;
  categoryId?: string;
  thumbnail?: string;
  status?: string;
}

export interface IPropertyQuery {
  searchTerm?: string;
  city?: string;
  categoryId?: string;
  minRent?: string;
  maxRent?: string;
  bedrooms?: string;
  bathrooms?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}
