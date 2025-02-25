import { RequestHandler } from "express";
import db from "../../config/mongodb";
import {
  badRequest,
  invalidCredentials,
  ok,
  serverError,
} from "../../utils/request";
import { User } from "../../interfaces/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { ObjectId } from "mongodb";

export const register: RequestHandler = async (req, res) => {
  const { username, email, password } = req.body;

  const emailExists = await db.collection<User>("users").findOne({ email });
  if (emailExists) {
    return badRequest(res, "Email alredy exists");
  }

  try {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.collection<User>("users").insertOne({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    const user = await db
      .collection<User>("users")
      .findOne({ _id: result.insertedId });

    if (user == null) {
      serverError(res, "User could not be created");
      return;
    }

    const token = jwt.sign(
      { id: user._id.toHexString(), role: user.role },
      JWT_SECRET
    );

    console.log("Register email:", user.email);

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
  const { email, password } = req.body;
  try {
    const user = await db.collection<User>("users").findOne({ email });

    if (!user) {
      invalidCredentials(res, "User Not Found");
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      invalidCredentials(res, "Password");
      return;
    }

    const token = jwt.sign(
      {
        id: user._id.toHexString(),
        role: user.role,
      },
      JWT_SECRET
    );

    console.log("Login email:", user.email);

    ok(
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      }),
      "Successfully Log In"
    );
  } catch (error) {
    serverError(res, error);
  }
};

export const logout: RequestHandler = async (req, res) => {
  ok(res.clearCookie("access_token"), "Successfully Log Out");
};

export const userInfo: RequestHandler = async (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    res.send({ ok: false });
    return;
  }

  try {
    const userToken = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };

    const id = userToken.id;

    const user = await db
      .collection<User>("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      serverError(res, "User could not be created");
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
