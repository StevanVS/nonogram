import { RequestHandler } from "express";
import db from "../../config/mongodb";
import { ok, serverError } from "../../utils/request";
import { User } from "../../interfaces/user";

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await db.collection<User>("users").find().toArray();

    ok(res, { users });
  } catch (error) {
    serverError(res, error);
  }
};
