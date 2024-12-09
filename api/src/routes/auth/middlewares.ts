import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { unauthorized } from "../../utils/request";

export const isAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return unauthorized(res);
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    req.userId = user.id;
    req.userRole = user.role;
    next();
  } catch (error) {
    unauthorized(res, error);
  }
};
