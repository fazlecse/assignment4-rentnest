import { z } from "zod";
import { PropertyStatus } from "../../../generated/prisma/enums";

const createPropertyValidation = z.object({
  body: z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    address: z.string(),
    city: z.string(),
    rent: z.number().positive(),
    bedrooms: z.number().int().positive(),
    bathrooms: z.number().int().positive(),
    categoryId: z.string().uuid(),
    thumbnail: z.string().url().optional(),
  }),
});

const updatePropertyValidation = z.object({
  body: z.object({
    title: z.string().min(5).optional(),
    description: z.string().min(20).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    rent: z.number().positive().optional(),
    bedrooms: z.number().int().positive().optional(),
    bathrooms: z.number().int().positive().optional(),
    categoryId: z.string().uuid().optional(),
    thumbnail: z.string().url().optional(),
    status: z.enum(PropertyStatus).optional(),
  }),
});

export const propertyValidation = {
  createPropertyValidation,
  updatePropertyValidation,
};
