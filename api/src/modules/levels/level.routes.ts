import express from "express";
import { getLevels } from "./level.controller";
const router = express.Router();

router.post("/", getLevels);

export default router;
