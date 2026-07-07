import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import { createToken } from "../../../helpers/jwtHelpers";
import { User } from "../user/user.model";
import { TLoginPayload } from "./auth.interface";

// Verify email/password and issue a JWT access token
const loginUser = async (payload: TLoginPayload) => {
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found with this email!");
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password!");
  }

  const { accessToken } = createToken({
    payload: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  return {
    token: accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// Fetch the logged-in user's own profile
const getMyProfile = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

export const AuthServices = {
  loginUser,
  getMyProfile,
};
