import httpStatus from "http-status";
import ApiError from "../errors/ApiErrors";
import { log } from "./log";

// Validate that an id is a well-formed MongoDB ObjectId string
export const checkMongodbID = (id: string) => {
  log("checkMongodbID ", id);

  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Id is required");
  }

  const result = /^[0-9a-fA-F]{24}$/.test(id);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Id is not valid");
  }

  return id;
};
