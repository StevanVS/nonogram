import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { badRequest, forbidden, unauthorized } from "../utils/request";
import { JWT_SECRET } from "../config";
import { JwtToken } from "../interfaces/jwt-token";

export const optionalAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next();

  try {
    const userToken = jwt.verify(token, JWT_SECRET) as JwtToken;

    req.userId = userToken.id;
    req.userRole = userToken.role;
    next();
  } catch (error) {
    next();
  }
};

export const isAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return unauthorized(res, "No Token provided");

  try {
    const userToken = jwt.verify(token, JWT_SECRET) as JwtToken;

    req.userId = userToken.id;
    req.userRole = userToken.role;
    next();
  } catch (error) {
    unauthorized(res, "Invalid Token");
  }
};

export const isAdmin: RequestHandler = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return unauthorized(res, "No Token provided");

  try {
    const userToken = jwt.verify(token, JWT_SECRET) as JwtToken;

    if (userToken.role !== "admin") return forbidden(res);

    req.userId = userToken.id;
    req.userRole = userToken.role;
    next();
  } catch (error) {
    badRequest(res, "Invalid Token");
  }
};
