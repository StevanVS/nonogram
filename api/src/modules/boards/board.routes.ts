import { Router } from "express";
import { createBoard, getBoards, updateBoard } from "./board.controller";

const router = Router();

router.get("/", getBoards);
router.post("/", createBoard);
router.put("/:id", updateBoard);

export default router;
