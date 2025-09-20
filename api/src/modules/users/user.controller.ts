import { RequestHandler } from "express";
import { UserModel } from "./user.model";
import { ok, serverError } from "../../utils/request";

export const user: RequestHandler = async (req, res) => {
  if (!req.userId) return ok(res, null);
  try {
    const user = await UserModel.findById(req.userId).select("-password");
    ok(res, user);
  } catch (error) {
    serverError(res, error);
  }
};
