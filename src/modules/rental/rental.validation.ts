import { z } from "zod";
import { RentalStatus } from "../../../generated/prisma/enums";

const createRentalRequestValidation = z.object({
  body: z.object({
    propertyId: z.string().uuid(),
    startDate: z.coerce.date(),
    months: z.number().int().positive(),
  }),
});

const updateRentalRequestStatusValidation = z.object({
  body: z.object({
    status: z.enum({
      APPROVED: RentalStatus.APPROVED,
      REJECTED: RentalStatus.REJECTED,
      COMPLETED: RentalStatus.COMPLETED,
    }),
  }),
});

export const rentalValidation = {
  createRentalRequestValidation,
  updateRentalRequestStatusValidation,
};
