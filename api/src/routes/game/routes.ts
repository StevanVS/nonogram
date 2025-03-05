import express from "express";
import { checkGameWin, getNewGameByLevel } from "./controllers";
const router = express.Router();

router.get("/newgamebylevel/:level", getNewGameByLevel);
router.post("/checkgamewin/:level", checkGameWin);

export default router
