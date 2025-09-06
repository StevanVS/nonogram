import express from "express";
import { deleteAllGames, getGame, getNewGame, saveGame } from "./game.controller";
import { isAuth, optionalAuth } from "../../common/auth.middleware";
const router = express.Router();

router.get("/getnewgame/:boardId", getNewGame);
router.post("/getgame/:boardId", optionalAuth, getGame);
router.post("/savegame", isAuth, saveGame);
router.delete("/", isAuth, deleteAllGames);

export default router;
