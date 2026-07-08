import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validate.request";
import { rentalValidation } from "./rental.validation";
import { rentalController } from "./rental.controller";

const router = Router();

router.post(
  "/",
  auth(Role.TENANT),
  validateRequest(rentalValidation.createRentalRequestValidation),
  rentalController.createRentalRequest,
);

router.get("/", auth(Role.TENANT), rentalController.getMyRentalRequests);

router.get(
  "/:id",
  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  rentalController.getSingleRentalRequest,
);

export const rentalRoutes = router;
