import { Router } from "express";
import { profile } from "./user.controller";
import { isAuth } from "../../common/auth.middleware";

const router = Router();

router.get("/profile", isAuth, profile);

export default router;
