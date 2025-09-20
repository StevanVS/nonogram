import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../../config";
import { JwtToken } from "../../interfaces/jwt-token";
import { RequestHandler } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import { badRequest, ok, serverError } from "../../utils/request";
import { UserModel } from "../users/user.model";

const generateToken = (token: JwtToken) => {
  return jwt.sign(token, JWT_SECRET, {
    expiresIn: "1h",
    subject: token.id,
  });
};

export const register: RequestHandler = async (req, res) => {
  const validReq = registerSchema.safeParse(req.body);
  if (!validReq.success) {
    return badRequest(res, JSON.parse(validReq.error.message));
  }

  const { username, email, password } = validReq.data;

  try {
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) return badRequest(res, "Email already registered");

    const user = await UserModel.create({ username, email, password });

    const token = generateToken({ id: user.id, role: user.role });

    const userToSend = { ...user.toJSON(), password: "" };

    ok(
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
      }),
      userToSend
    );
  } catch (error) {
    serverError(res, error);
  }
};

export const login: RequestHandler = async (req, res) => {
  const validReq = loginSchema.safeParse(req.body);
  if (!validReq.success) {
    return badRequest(res, JSON.parse(validReq.error.message));
  }

  const { email, password } = validReq.data;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) return badRequest(res, "User not found");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return badRequest(res, "Invalid credentials");

    const token = generateToken({ id: user.id, role: user.role });

    const userToSend = { ...user.toJSON(), password: "" };

    ok(
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
      }),
      userToSend
    );
  } catch (error) {
    serverError(res, error);
  }
};

export const logout: RequestHandler = async (req, res) => {
  ok(res.clearCookie("access_token"), "Successfully Log Out");
};

export const checkToken: RequestHandler = async (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    res.send({ ok: false, message: "Token not found" });
    return;
  }

  try {
    jwt.verify(token, JWT_SECRET);
    ok(res);
  } catch (error) {
    res.clearCookie("access_token").send({ ok: false });
  }
};
