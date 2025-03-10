import express from "express";

import auth from "./auth/routes";
import board from "./boards/routes";
import game from "./game/routes";
import levels from "./levels/routes";
import users from "./users/routes";

const routes = express.Router();

routes.use("/auth", auth);
routes.use("/board", board);
routes.use("/game", game);
routes.use("/levels", levels);
routes.use("/users", users);

export default routes;
