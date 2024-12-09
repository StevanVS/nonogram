import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { badRequest } from "./request";

export const validate: RequestHandler = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    return badRequest(res, errors);
  }
  next()
};
