import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validate.request";
import { reviewValidation } from "./review.validation";
import { reviewController } from "./review.controller";

const router = Router();

router.post(
  "/",
  auth(Role.TENANT),
  validateRequest(reviewValidation.createReviewValidation),
  reviewController.createReview,
);

export const reviewRoutes = router;
