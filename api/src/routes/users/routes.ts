import express from "express";
import { currentUser } from "./controllers";
import { isAuth } from "../auth/middlewares";
const router = express.Router();

router.get("/currentuser", isAuth, currentUser);

export default router;
