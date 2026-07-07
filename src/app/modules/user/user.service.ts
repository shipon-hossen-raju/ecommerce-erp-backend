import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import { User } from "./user.model";
import { TUserRole } from "./user.interface";

type TCreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
};

// Create a new user, rejecting duplicate emails
const createUser = async (payload: TCreateUserPayload) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `User with email ${payload.email} already exists`,
    );
  }

  const user = await User.create(payload);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

// List all users (password excluded), newest first
const getAllUsers = async () => {
  return User.find().select("-password").sort("-createdAt");
};

// Fetch a single user by id
const getUserById = async (id: string) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

type TUpdateUserPayload = Partial<{
  name: string;
  password: string;
  role: TUserRole;
}>;

// Update editable fields (name/role/password) for a user
const updateUser = async (id: string, payload: TUpdateUserPayload) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.name !== undefined) user.name = payload.name;
  if (payload.role !== undefined) user.role = payload.role;
  if (payload.password !== undefined) user.password = payload.password;

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    updatedAt: user.updatedAt,
  };
};

// Permanently remove a user by id
const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return null;
};

export const userService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
