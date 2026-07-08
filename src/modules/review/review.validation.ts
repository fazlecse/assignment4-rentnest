import { z } from "zod";

const createReviewValidation = z.object({
  body: z.object({
    propertyId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(5),
  }),
});

export const reviewValidation = {
  createReviewValidation,
};
