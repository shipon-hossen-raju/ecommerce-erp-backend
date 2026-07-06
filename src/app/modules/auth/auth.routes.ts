import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { authValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/login",
  validateRequest({
    schema: authValidation.loginValidationSchema,
  }),
  AuthController.loginUser,
);

router.get("/me", auth({}), AuthController.getMyProfile);

export const authRoutes = router;
