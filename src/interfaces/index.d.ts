import { JwtPayloadUser } from "./global.type";

declare global {
  namespace Express {
    interface User extends JwtPayloadUser {}

    interface Request {
      user: JwtPayloadUser;
    }
  }
}

export {};
