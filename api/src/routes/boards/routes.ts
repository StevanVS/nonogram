import express from "express";
import { getBoard, getBoards, newBoard } from "./controllers";
const router = express.Router();

router.get("/", getBoards);
router.get("/:id", getBoard);
router.post('/', newBoard)

module.exports = router
