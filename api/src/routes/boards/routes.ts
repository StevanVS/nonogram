import express from "express";
import { deleteBoard, getBoard, getBoards, newBoard, updateBoard } from "./controllers";
const router = express.Router();

router.get("/", getBoards);
router.get("/:id", getBoard);
router.post('/', newBoard)
router.put('/:id', updateBoard)
router.delete('/:id', deleteBoard)

export default router

