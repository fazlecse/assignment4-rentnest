import { z } from "zod";

const createCheckoutSessionValidation = z.object({
  body: z.object({
    rentalRequestId: z.string().uuid(),
  }),
});

export const paymentValidation = {
  createCheckoutSessionValidation,
};
