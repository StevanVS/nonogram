import express from "express";
import { login, logout, register } from "./controllers";
import { body } from "express-validator";
import { validate } from "../../utils/middlewares";
const router = express.Router();

router.post(
  "/register",
  body("username", "Name can't be empty").notEmpty(),
  body("email", "Incorrect email").isEmail(),
  body("password", "Password must be greater than 5 digits")
    .isString()
    .isLength({ min: 5 }),
  validate,
  register,
);

router.post("/login", login);

router.post("/logout", logout);

module.exports = router;
