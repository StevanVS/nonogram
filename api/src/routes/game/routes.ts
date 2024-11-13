import express from "express";
import { checkGameWin, getNewGame, getNewGameByLevel } from "./controllers";
const router = express.Router();

router.get("/newgame/:boardId", getNewGame);
router.get("/newgamebylevel/:level", getNewGameByLevel);
router.post("/checkgamewin/:boardId", checkGameWin);

module.exports = router
