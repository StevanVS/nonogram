import { RequestHandler } from "express";
import db from "../../config/mongodb";
import { ok, serverError } from "../../utils/request";
import { User } from "../../interfaces/user";
import { ObjectId } from "mongodb";

export const currentUser: RequestHandler = async (req, res) => {
  try {
    const id = req.userId;

    const user = await db
      .collection<User>("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      serverError(res, "User not found");
      return;
    }

    ok(res, {
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    serverError(res, error);
  }
};
