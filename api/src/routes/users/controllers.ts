import { RequestHandler } from "express";
import db from "../../config/mongodb";
import { notFound, ok, serverError } from "../../utils/request";
import { UserDocument } from "../../interfaces/user";

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await db.collection("users").find(
    ).toArray() as UserDocument[]

    ok(res, { users, authUser: req.body.authUser });
  } catch (error) {
    serverError(res, error);
  }
};

