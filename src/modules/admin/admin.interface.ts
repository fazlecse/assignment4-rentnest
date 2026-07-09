export interface IAdminUserQuery {
  role?: string;
  status?: string;
  searchTerm?: string;
  page?: string;
  limit?: string;
}

export interface IAdminPropertyQuery {
  searchTerm?: string;
  city?: string;
  categoryId?: string;
  status?: string;
  page?: string;
  limit?: string;
}

export interface IAdminRentalQuery {
  status?: string;
  page?: string;
  limit?: string;
}

export interface IUpdateUserStatusPayload {
  status: string;
}
