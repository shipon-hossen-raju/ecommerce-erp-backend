import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiErrors";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { JwtPayloadUser } from "../../interfaces/global.type";
import { User } from "../modules/user/user.model";
import { TUserRole } from "../modules/user/user.interface";

const auth = (...allowedRoles: TUserRole[]) => {
  return async (
    req: Request & { user?: JwtPayloadUser },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const verifiedUser = jwtHelpers.verifyToken(token);
      const { id } = verifiedUser;

      const user = await User.findById(id);

      if (!user) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Please login again! Your token is invalid or expired.",
        );
      }

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "You do not have permission to perform this action!",
        );
      }

      req.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
