import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validate.request";
import { rentalValidation } from "./rental.validation";
import { rentalController } from "./rental.controller";

const router = Router();

router.get(
  "/",
  auth(Role.LANDLORD),
  rentalController.getLandlordRentalRequests,
);

router.patch(
  "/:id",
  auth(Role.LANDLORD),
  validateRequest(rentalValidation.updateRentalRequestStatusValidation),
  rentalController.updateRentalRequestStatus,
);

export const landlordRentalRoutes = router;
