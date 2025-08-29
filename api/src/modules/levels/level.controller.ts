import { RequestHandler } from "express";
import { badRequest, ok, serverError } from "../../utils/request";
import { BoardModel } from "../boards/board.model";
import { getLevelsSchema } from "./level.validation";
import { getProgressPercentage, isGameComplete } from "./level.utils";
import { Board } from "../../interfaces/board";

export const getLevels: RequestHandler = async (req, res) => {
  const validReq = getLevelsSchema.safeParse(req.body);
  if (!validReq.success) {
    return badRequest(res, JSON.parse(validReq.error.message));
  }

  const games = validReq.data.games || [];

  try {
    const result = await BoardModel.find().sort({ order: 1 });

    const levels = result.map((b) => {
      const game = games.find((g) => g.boardId === b.id);
      let complete = false;
      if (game) {
        complete = isGameComplete(game.gameTiles, b as Board);
      }
      return {
        id: b.id,
        order: b.order,
        // complete: complete,
        progressPercentage: game
          ? getProgressPercentage(game.gameTiles, b as Board)
          : 0,
        coloredTiles: complete ? b.coloredTiles : [],
        width: b.width,
        height: b.height,
      };
    });

    return ok(res, levels);
  } catch (error) {
    return serverError(res);
  }
};
