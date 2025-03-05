import express from "express";
import { getUsers } from "./controllers";
import { isAuth } from "../auth/middlewares";
const router = express.Router();

router.get("/", isAuth, getUsers);

export default router;
