import { Request } from "express";
import { TUserRole } from "../app/modules/user/user.interface";

export type JwtPayloadUser = {
  id: string;
  name: string;
  email: string;
  role: TUserRole;
};

export interface AuthRequest extends Request {
  user: JwtPayloadUser; // non-optional override
}
