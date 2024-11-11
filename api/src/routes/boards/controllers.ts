import { RequestHandler } from "express";
import db from "../../config/mongodb";
import { ObjectId } from "mongodb";
import { notFound, ok, serverError } from "../../utils/request";
import { getColumnNumbers, getRowNumbers } from "../../utils/boards";

export const getBoards: RequestHandler = async (req, res) => {
  try {
    const result = await db.collection("boards").find(
      {}, { sort: { level: 1 } }
    ).toArray();
    ok(res, result);
  } catch (error) {
    serverError(res, error);
  }
};

export const getBoard: RequestHandler = async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await db.collection("boards").findOne(query);
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
    const board = {
      ...req.body,
      filledTilesNumber: req.body.filledTiles
        .reduce((count: number, num: number) => num === 1 ? count + 1 : count, 0),
      columnNumbers: getColumnNumbers(req.body),
      rowNumbers: getRowNumbers(req.body),
    }

    const result = await db.collection("boards").insertOne(board);

    const newBoard = await db.collection("boards").findOne(
      { _id: result.insertedId }
    );

    ok(res, newBoard);
  } catch (error) {
    serverError(res, error);
  }
};

export const updateBoard: RequestHandler = async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const { _id, ...board } = req.body;

    const result = await db.collection("boards").updateOne(query, {
      $set: board,
    });

    if (!result.modifiedCount) {
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
