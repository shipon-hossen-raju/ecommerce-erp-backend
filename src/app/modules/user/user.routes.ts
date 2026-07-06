import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "./user.interface";
import { userController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  validateRequest({
    schema: UserValidation.createUserValidationSchema,
  }),
  userController.createUser,
);

router.get("/", auth(USER_ROLE.ADMIN), userController.getAllUsers);

router.get("/:id", auth(USER_ROLE.ADMIN), userController.getUserById);

router.put(
  "/:id",
  auth(USER_ROLE.ADMIN),
  validateRequest({
    schema: UserValidation.updateUserValidationSchema,
  }),
  userController.updateUser,
);

router.delete("/:id", auth(USER_ROLE.ADMIN), userController.deleteUser);

export const userRoutes = router;
