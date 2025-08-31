import { RequestHandler } from "express";
import { badRequest, ok, serverError } from "../../utils/request";
import { BoardModel } from "../boards/board.model";
import { getLevelsSchema } from "./level.validation";
import { GameModel } from "../games/game.model";

export const getLevels: RequestHandler = async (req, res) => {
  if (req.userId) {
    req.body.games = await GameModel.find({ userId: req.userId }).lean();
  }

  const validReq = getLevelsSchema.safeParse(req.body);
  if (!validReq.success) {
    return badRequest(res, JSON.parse(validReq.error.message));
  }

  const games = validReq.data.games || [];

  try {
    const result = await BoardModel.find().sort({ order: 1 });

    const levels = result.map((board) => {
      const game = games.find((g) => g.boardId === board.id);
      let complete = false;
      if (game) {
        complete = board.isGameComplete(game.gameTiles);
      }
      return {
        id: board.id,
        order: board.order,
        progressPercentage: game
          ? board.getProgressPercentage(game.gameTiles)
          : 0,
        coloredTiles: complete ? board.coloredTiles : [],
        width: board.width,
        height: board.height,
      };
    });

    return ok(res, levels);
  } catch (error) {
    return serverError(res);
  }
};
