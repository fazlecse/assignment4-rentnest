import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validate.request";
import { categoryValidation } from "./category.validation";
import { categoryController } from "./category.controller";
const router = Router();

router.get("/", categoryController.getAllCategories);

router.get("/:id", categoryController.getSingleCategory);

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.createCategoryValidation),
  categoryController.createCategory,
);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.updateCategoryValidation),
  categoryController.updateCategory,
);

router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoutes = router;
