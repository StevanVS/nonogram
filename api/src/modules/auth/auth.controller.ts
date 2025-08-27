import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { JwtToken } from "../../interfaces/jwt-token";
import { RequestHandler } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import { badRequest, ok, serverError } from "../../utils/request";
import { User } from "../users/user.model";

const generateToken = (token: JwtToken) => {
  return jwt.sign(token, JWT_SECRET, { expiresIn: "1h" });
};

export const register: RequestHandler = async (req, res) => {
  const validReq = registerSchema.safeParse(req.body);
  if (!validReq.success) {
    return badRequest(res, validReq.error.message);
  }

  const { username, email, password } = validReq.data;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) return badRequest(res, "Email already registered");

    const user = await User.create({ username, email, password });

    const token = generateToken({ id: user.id, role: user.role });

    ok(
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      }),
      "Successfully Register"
    );
  } catch (error) {
    serverError(res, error);
  }
};

export const login: RequestHandler = async (req, res) => {
  const validReq = loginSchema.safeParse(req.body);
  if (!validReq.success) {
    return badRequest(res, validReq.error.message);
  }

  const { email, password } = validReq.data;

  try {
    const user = await User.findOne({ email: email });

    if (!user) return badRequest(res, "User not found");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return badRequest(res, "Invalid credentials");

    const token = generateToken({ id: user.id, role: user.role });

    ok(
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      }),
      "Successfully Register"
    );
  } catch (error) {
    serverError(res, error);
  }
};

export const logout: RequestHandler = async (req, res) => {
  ok(res.clearCookie("access_token"), "Successfully Log Out");
};