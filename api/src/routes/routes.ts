import express from "express";

import auth from "./auth/routes";
import board from "./boards/routes";
import game from "./game/routes";
import levels from "./levels/routes";
import users from "./users/routes";

const routes = express.Router();

routes.use(auth);
routes.use(board);
routes.use(game);
routes.use(levels);
routes.use(users);

export default routes;
