import { Router } from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middlewares/validate.request";
import { registerValidation } from "./auth.validation";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post(
  "/register",
  validateRequest(registerValidation),
  authController.registerUser,
);

router.post("/login", authController.loginUser);

router.get(
  "/me",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  authController.getMyProfile,
);

export const authRoutes = router;
