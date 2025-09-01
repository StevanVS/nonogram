import { Router } from "express";
import {
  createBoard,
  deleteBoard,
  getBoards,
  updateBoard,
} from "./board.controller";
import { isAdmin } from "../../common/auth.middleware";

const router = Router();

router.get("/", isAdmin, getBoards);
router.post("/", isAdmin, createBoard);
router.put("/:id", isAdmin, updateBoard);
router.delete("/:id", isAdmin, deleteBoard);

export default router;
