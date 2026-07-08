import { z } from "zod";

const createCategoryValidation = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Category name is required").max(50),
  }),
});

const updateCategoryValidation = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(50).optional(),
  }),
});

export const categoryValidation = {
  createCategoryValidation,
  updateCategoryValidation,
};
