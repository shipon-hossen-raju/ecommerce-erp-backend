import { z } from "zod";
import { authValidation } from "./auth.validation";

export type TLoginPayload = z.infer<typeof authValidation.loginValidationSchema>;
