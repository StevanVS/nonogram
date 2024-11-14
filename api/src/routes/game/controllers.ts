import { RequestHandler } from "express";
import db from "../../config/mongodb";
import { ObjectId } from "mongodb";
import { notFound, ok, serverError } from "../../utils/request";

export const getNewGameByLevel: RequestHandler = async (req, res) => {
  try {
    const query = { level: parseInt(req.params.level) };
    const board = await db.collection("boards").findOne(query);
    if (!board) {
      notFound(res, "Board Not Found");
      return;
    }

    const game = {
      gameTiles: Array.from({ length: board.width * board.height }).fill(0),
      history: [],
      width: board.width,
      height: board.height,
      innerColumn: board.innerColumn,
      innerRow: board.innerRow,
      filledTilesNumber: board.filledTilesNumber,
      columnNumbers: board.columnNumbers,
      rowNumbers: board.rowNumbers,
      level: board.level,
    }

    ok(res, game);
  } catch (error) {
    serverError(res, error);
  }
};

export const checkGameWin: RequestHandler = async (req, res) => {
  try {
    const board = await db.collection("boards").findOne(
      { level: Number(req.params.level) }
    );
    if (!board) {
      notFound(res, "Board Not Found");
      return;
    }

    const gameTiles: number[] = req.body.gameTiles;

    const isWin = gameTiles.every((gt, i) => {
      let gameTile = gt <= 0 ? 0 : 1;
      return gameTile == board.filledTiles[i];
    })

    const gameWin = {
      isWin,
      boardId: board._id,
      coloredTiles: isWin ? board.coloredTiles : [],
      name: board.name,
    }

    ok(res, gameWin);
  } catch (error) {
    serverError(res, error);
  }
};
