import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { fromError } from "zod-validation-error";
import APIError from "./APIError";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      const error = fromError(err);
      next(new APIError(error.message, 400));
    }
  };
