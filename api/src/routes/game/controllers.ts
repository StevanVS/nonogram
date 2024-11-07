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
      filledTilesNumber: board.filledTiles.reduce((count: number, num: number) => num === 1 ? count + 1 : count, 0),
      columnNumbers: getColumnNumbers(board),
      rowNumbers: getRowNumbers(board),
      width: board.width,
      height: board.height,
      innerColumn: board.innerColumn || 0,
      innerRow: board.innerRow || 0, 
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

    ok(res, { isWin, coloredTiles: isWin ? board.coloredTiles : [] });
  } catch (error) {
    serverError(res, error);
  }
};

function getColumnNumbers(board: any): number[][] {
  const ftl: number[][] = [];
  for (let x = 0; x < board.width; x++) {
    const tiles: number[] = [];
    for (let y = 0; y < board.height; y++) {
      tiles.push(board.filledTiles[board.width * y + x]);
    }
    ftl.push(getFilledTilesNumbers(tiles));
  }
  return ftl;
}

function getRowNumbers(board: any): number[][] {
  const ftl: number[][] = [];
  for (let y = 0; y < board.height; y++) {
    const tiles = board.filledTiles.slice(board.width * y, board.width * y + board.width);
    ftl.push(getFilledTilesNumbers(tiles));
  }
  return ftl;
}

function getFilledTilesNumbers(tiles: number[]) {
  const filledTilesNumbers = [];

  let counter = 0;

  tiles.forEach((tile, i, arr) => {
    if (tile == 1) {
      counter++;
    }
    if ((tile == 0 || tile == -1 || i + 1 === arr.length) && counter > 0) {
      filledTilesNumbers.push(counter);
      counter = 0;
    }
  });

  if (filledTilesNumbers.length == 0) filledTilesNumbers.push(0);

  return filledTilesNumbers;
}

