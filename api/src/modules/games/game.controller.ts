import { RequestHandler } from "express";
import { getGameSchema, saveGameSchema } from "./game.validation";
import { badRequest, ok, serverError } from "../../utils/request";
import { BoardModel } from "../boards/board.model";
import { Board } from "../../interfaces/board";
import { Game } from "../../interfaces/game";
import { GameModel } from "./game.model";

export const getGame: RequestHandler = async (req, res) => {
  const boardId = req.params.boardId;
  try {
    if (req.userId) {
      req.body.game = await GameModel.findOne({
        userId: req.userId,
        boardId: boardId,
      }).lean();
    }

    const validReq = getGameSchema.safeParse(req.body);
    if (!validReq.success) {
      return badRequest(res, JSON.parse(validReq.error.message));
    }

    let game = validReq.data.game;

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

export const getNewGame: RequestHandler = async (req, res) => {
  const boardId = req.params.boardId;
  try {
    const board = await BoardModel.findById(boardId);
    if (board == null) {
      return badRequest(res, "Board Not Found");
    }

    const game: Game = {
      boardId: boardId,
      gameTiles: Array.from<number>({
        length: board.width * board.height,
      }).fill(0),
      history: [],
    };

    const result: { game: Game; board: Board } = {
      game,
      board: {
        ...board.toJSON(),
        filledTiles: [],
        coloredTiles: [],
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
    await GameModel.findOneAndUpdate(
      { userId: req.userId, boardId: game.boardId },
      { $set: { ...game, userId: req.userId } },
      { upsert: true }
    );
    ok(res);
  } catch (error) {
    serverError(res, error);
  }
};

export const deleteAllGames: RequestHandler = async (req, res) => {
  try {
    await GameModel.deleteMany({ userId: req.userId });
    ok(res);
  } catch (error) {
    serverError(res, error);
  }
};
