import express from "express";
import { login } from "./controllers";
const router = express.Router();

router.post("/login", login);

module.exports = router
