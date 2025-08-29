import { Router } from "express";
import { checkToken, login, logout, register } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/checktoken", checkToken);

export default router;
