export interface ICreateRentalRequestPayload {
  propertyId: string;
  startDate: Date;
  months: number;
}

export interface IRentalRequestQuery {
  status?: string;
  page?: string;
  limit?: string;
}
