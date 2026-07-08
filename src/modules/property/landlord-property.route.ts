import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { propertyValidation } from "./property.validation";
import validateRequest from "../../middlewares/validate.request";
import { propertyController } from "./property.controller";

const router = Router();

router.post(
  "/",
  auth(Role.LANDLORD),
  validateRequest(propertyValidation.createPropertyValidation),
  propertyController.createProperty,
);

router.put(
  "/:id",
  auth(Role.LANDLORD),
  validateRequest(propertyValidation.updatePropertyValidation),
  propertyController.updateProperty,
);

router.delete("/:id", auth(Role.LANDLORD), propertyController.deleteProperty);

export const landlordPropertyRoutes = router;
