import express from "express";
import { getLevels } from "./controllers";
const router = express.Router();

router.get("/", getLevels);

module.exports = router

