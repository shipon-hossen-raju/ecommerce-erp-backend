import httpStatus from "http-status";
import ApiError from "../errors/ApiErrors";
import { log } from "./log";

export const checkMongodbID = (id: string) => {
  log("checkMongodbID ", id);

  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Id is required");
  }

  return /^[0-9a-fA-F]{24}$/.test(id);
};
