import { Router } from "express";
import { user } from "./user.controller";
import { isAuth, optionalAuth } from "../../common/auth.middleware";

const router = Router();

router.get("/user", optionalAuth, user);

export default router;
