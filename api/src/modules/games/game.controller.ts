import { RequestHandler } from "express";
import { getGameSchema, saveGameSchema } from "./game.validation";
import { badRequest, ok, serverError } from "../../utils/request";
import { BoardModel } from "../boards/board.model";
import { Board } from "../../interfaces/board";
import { UserModel } from "../users/user.model";
import { Game } from "../../interfaces/game";

export const getGame: RequestHandler = async (req, res) => {
  const validReq = getGameSchema.safeParse(req.body);
  if (!validReq.success) {
    return badRequest(res, JSON.parse(validReq.error.message));
  }

  const boardId = req.params.boardId;
  let game = validReq.data.game;

  try {
    const board = await BoardModel.findById(boardId);
    if (board == null) {
      return badRequest(res, "Board Not Found");
    }

    if (game == null) {
      game = {
        boardId: boardId,
        gameTiles: Array.from<number>({
          length: board.width * board.height,
        }).fill(0),
        history: [],
      };
    }

    const gameComplete = board.isGameComplete(game.gameTiles);

    const result: { game: Game; board: Board } = {
      game,
      board: {
        ...board.toJSON(),
        filledTiles: [],
        coloredTiles: gameComplete ? board.coloredTiles : [],
      },
    };

    ok(res, result);
  } catch (error) {
    serverError(res, error);
  }
};

export const saveGame: RequestHandler = async (req, res) => {
  const validReq = saveGameSchema.safeParse(req.body);
  if (!validReq.success) {
    return badRequest(res, JSON.parse(validReq.error.message));
  }

  const game = validReq.data.game;

  try {
    await UserModel.updateOne(
      { _id: req.userId, "games.boardId": game.boardId },
      { $set: { "games.$": game } } // actualiza si existe
    );

    await UserModel.updateOne(
      { _id: req.userId, "games.boardId": { $ne: game.boardId } },
      { $push: { games: game } } // inserta si no existe
    );

    ok(res);
  } catch (error) {
    serverError(res, error);
  }
};
