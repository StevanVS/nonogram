import { RequestHandler } from "express";
import db from "../../config/mongodb";
import { ObjectId } from "mongodb";
import { notFound, ok, serverError } from "../../utils/request";

export const getBoards: RequestHandler = async (req, res) => {
  try {
    const result = await db.collection("boards").find().toArray();
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
    const newBoard = req.body
    const result = await db.collection("boards").insertOne(newBoard);
    ok(res, result);
  } catch (error) {
    serverError(res, error);
  }
};
