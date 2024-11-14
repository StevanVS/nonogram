import express from "express";
import { getLevels } from "./controllers";
const router = express.Router();

router.post("/", getLevels);

module.exports = router

