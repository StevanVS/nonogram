import express from "express";
import { getGame, saveGame } from "./game.controller";
import { isAuth, optionalAuth } from "../../common/auth.middleware";
const router = express.Router();

router.post("/getgame/:boardId",optionalAuth, getGame);
router.post("/savegame", isAuth, saveGame);

export default router;
