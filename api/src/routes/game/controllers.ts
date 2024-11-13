import { RequestHandler } from "express";
import db from "../../config/mongodb";
import { ObjectId } from "mongodb";
import { notFound, ok, serverError } from "../../utils/request";

export const getNewGame: RequestHandler = async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.boardId) };
    const board = await db.collection("boards").findOne(query);
    if (!board) {
      notFound(res, "Board no encontrado");
      return;
    }

    const game = {
      gameTiles: Array.from({ length: board.width * board.height }).fill(0),
      history: [],
      width: board.width,
      height: board.height,
      innerColumn: board.innerColumn,
      innerRow: board.innerRow,
      boardId: board._id,
      level: board.level,
    }

    ok(res, game);
  } catch (error) {
    serverError(res, error);
  }
};

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
      boardId: board._id,
      level: board.level,
    }

    ok(res, game);
  } catch (error) {
    serverError(res, error);
  }
};

export const checkGameWin: RequestHandler = async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.boardId) };
    const board = await db.collection("boards").findOne(query);
    if (!board) {
      notFound(res, "Board no encontrado");
      return;
    }

    const gameTiles: number[] = req.body.gameTiles;

    const isWin = gameTiles.every((gt, i) => {
      let gameTile = gt <= 0 ? 0 : 1;
      return gameTile == board.filledTiles[i];
    })

    const gameWin = {
      isWin,
      coloredTiles: isWin ? board.coloredTiles : [],
      name: board.name,
    }

    ok(res, gameWin);
  } catch (error) {
    serverError(res, error);
  }
};
