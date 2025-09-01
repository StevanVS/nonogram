import express from "express";
import { deleteAllGames, getGame, saveGame } from "./game.controller";
import { isAuth, optionalAuth } from "../../common/auth.middleware";
const router = express.Router();

router.post("/getgame/:boardId",optionalAuth, getGame);
router.post("/savegame", isAuth, saveGame);
router.delete("/", isAuth, deleteAllGames);

export default router;
