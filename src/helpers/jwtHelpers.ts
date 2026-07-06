import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../app/modules/user/user.interface";

const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  } as jwt.SignOptions);

  return token;
};

const verifyToken = (token: string) => {
  const secretKey = config.jwt.jwt_secret;
  return jwt.verify(token, secretKey!) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};

export function createToken({
  payload,
}: {
  payload: {
    id: string;
    name: string;
    email: string;
    role: TUserRole;
  };
}) {
  const accessToken = jwtHelpers.generateToken(
    payload,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  return { accessToken };
}
