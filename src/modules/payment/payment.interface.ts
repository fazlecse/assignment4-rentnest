export interface ICreateCheckoutSessionPayload {
  rentalRequestId: string;
}

export interface IPaymentQuery {
  status?: string;
  page?: string;
  limit?: string;
}
