import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validate.request";
import { adminValidation } from "./admin.validation";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);

router.patch(
  "/users/:id",
  auth(Role.ADMIN),
  validateRequest(adminValidation.updateUserStatusValidation),
  adminController.updateUserStatus,
);

router.get(
  "/properties",
  auth(Role.ADMIN),
  adminController.getAllProperties,
);

router.get("/rentals", auth(Role.ADMIN), adminController.getAllRentalRequests);

export const adminRoutes = router;
