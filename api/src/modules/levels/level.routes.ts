import express from "express";
import { getLevels } from "./level.controller";
import { optionalAuth } from "../../common/auth.middleware";
const router = express.Router();

router.post("/", optionalAuth, getLevels);

export default router;
