import express from "express";
import { checkGameWin, getNewGame } from "./controllers";
const router = express.Router();

router.get("/newgame/:boardId", getNewGame);
router.post("/checkgamewin/:boardId", checkGameWin);

module.exports = router
