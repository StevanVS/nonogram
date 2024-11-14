import { RequestHandler } from "express";
import db from "../../config/mongodb";
import { invalidCredentials, serverError } from "../../utils/request";
import { UserDocument } from "../../interfaces/user";

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.collection("users").findOne(
      { email }
    ) as UserDocument

    if (!user) {
      invalidCredentials(res)
      return;
    }

    // TODO: aplicar bcrypt 
    const passwordMatch = user.password == password
    if (!passwordMatch) {
      invalidCredentials(res)
      return;
    }

    res.header('x-auth', JSON.stringify(user)).send(user);
  } catch (error) {
    serverError(res, error);
  }
};


