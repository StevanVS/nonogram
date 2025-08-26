import { Router } from "express";
import { createBoard, deleteBoard, getBoards, updateBoard } from "./board.controller";

const router = Router();

router.get("/", getBoards);
router.post("/", createBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;
