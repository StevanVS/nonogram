import express from "express";
import { getBoard, getBoards } from "./controllers";
const router = express.Router();

router.get("/", getBoards);
router.get("/:id", getBoard);

module.exports = router
