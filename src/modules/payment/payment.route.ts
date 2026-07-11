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

router.post("/webhook", paymentController.handleWebhook);

router.get("/", auth(Role.TENANT), paymentController.getMyPayments);

router.get(
  "/:id",
  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  paymentController.getSinglePayment,
);

export const paymentRoutes = router;
