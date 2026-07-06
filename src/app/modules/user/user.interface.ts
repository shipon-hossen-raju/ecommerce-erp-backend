import { Model, Types } from "mongoose";

export const USER_ROLE = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel extends Model<IUser> {
  isPasswordMatched(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
