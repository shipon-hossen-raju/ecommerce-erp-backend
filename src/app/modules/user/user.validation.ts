import { z } from "zod";
import { USER_ROLE } from "./user.interface";

const createUserValidationSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address")
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password too long"),
  role: z.nativeEnum(USER_ROLE, {
    errorMap: () => ({ message: "Role must be ADMIN, MANAGER or EMPLOYEE" }),
  }),
});

const updateUserValidationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50).optional(),
  password: z.string().min(6, "Password must be at least 6 characters").max(50).optional(),
  role: z.nativeEnum(USER_ROLE).optional(),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
