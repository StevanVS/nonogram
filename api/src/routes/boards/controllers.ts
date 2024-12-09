import { RequestHandler } from "express";
import db from "../../config/mongodb";
import { ObjectId } from "mongodb";
import { notFound, ok, serverError } from "../../utils/request";
import {
  getColumnNumbers,
  getFilledTilesNumber,
  getRowNumbers,
} from "../../utils/boards";
import { Board } from "../../interfaces/board";

export const getBoards: RequestHandler = async (req, res) => {
  try {
    const result = await db
      .collection<Board>("boards")
      .find({}, { sort: { level: 1 } })
      .toArray();
    ok(res, result);
  } catch (error) {
    serverError(res, error);
  }
};

export const getBoard: RequestHandler = async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await db.collection<Board>("boards").findOne(query);
    if (!result) {
      notFound(res, "Board no encontrado");
      return;
    }
    ok(res, result);
  } catch (error) {
    serverError(res, error);
  }
};

export const newBoard: RequestHandler = async (req, res) => {
  try {
    let board: Board = { ...req.body };

    board = {
      ...board,
      filledTilesNumber: getFilledTilesNumber(board),
      columnNumbers: getColumnNumbers(board),
      rowNumbers: getRowNumbers(board),
    };

    const result = await db.collection<Board>("boards").insertOne(board);

    const newBoard = await db
      .collection<Board>("boards")
      .findOne({ _id: result.insertedId });

    ok(res, newBoard);
  } catch (error) {
    serverError(res, error);
  }
};

export const updateBoard: RequestHandler = async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    let board = req.body;

    board = {
      ...board,
      filledTilesNumber: getFilledTilesNumber(board),
      columnNumbers: getColumnNumbers(board),
      rowNumbers: getRowNumbers(board),
    };

    const result = await db
      .collection<Board>("boards")
      .findOneAndUpdate(query, { $set: board }, { returnDocument: "after" });

    if (!result) {
      notFound(res, "Board no encontrado");
      return;
    }

    ok(res, board);
  } catch (error) {
    serverError(res, error);
  }
};

export const deleteBoard: RequestHandler = async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await db.collection("boards").deleteOne(query);

    if (!result.deletedCount) {
      notFound(res, "Board no encontrado");
      return;
    }

    ok(res, result);
  } catch (error) {
    serverError(res, error);
  }
};
