import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { log } from "../../utils/log";

// Validate req.body (or parsed form-data field) against a Zod schema before the controller runs
const validateRequest = ({
  schema,
  dataType = "row",
  dataSource = "data",
}: {
  schema: AnyZodObject;
  dataType?: "row" | "formData";
  dataSource?: "data" | string;
}) => {
  if (dataType === "row") {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        log("validateRequest req.body row", req.body);
        const result = await schema.parseAsync(req.body);
        req.body = result;
        return next();
      } catch (err) {
        next(err);
      }
    };
  }
  if (dataType === "formData") {
    return async (req: Request, res: Response, next: NextFunction) => {
      log("validateRequest req.body formData", req.body);
      const data = req.body[dataSource]
        ? JSON.parse(req.body[dataSource] ?? "{}")
        : {};

      log("data ", data);

      try {
        const result = await schema.parseAsync(data);
        req.body = result;
        return next();
      } catch (err) {
        next(err);
      }
    };
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;
