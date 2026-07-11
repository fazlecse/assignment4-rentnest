import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validate.request";
import { paymentValidation } from "./payment.validation";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/checkout",
  auth(Role.TENANT),
  validateRequest(paymentValidation.createCheckoutSessionValidation),
  paymentController.createCheckoutSession,
);

export const paymentRoutes = router;
