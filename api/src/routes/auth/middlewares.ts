import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { unauthorized } from "../../utils/request";
import { JwtToken } from "../../interfaces/jwt-token";

export const isAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return unauthorized(res);
  }

  try {
    const userToken = jwt.verify(token, JWT_SECRET) as JwtToken;

    req.userId = userToken.id;
    req.userRole = userToken.role;
    next();
  } catch (error) {
    unauthorized(res, error);
  }
};

export const generateToken = (token: JwtToken) => {
  return jwt.sign(token, JWT_SECRET, { expiresIn: "1h" });
};
