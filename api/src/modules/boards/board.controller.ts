import { RequestHandler } from "express";
import { createBoardSchema } from "./board.validation";
import { badRequest, ok, serverError } from "../../utils/request";
import { Board } from "./board.model";
import { ObjectId } from "mongodb";

export const getBoards: RequestHandler = async (req, res) => {
  try {
    const result = await Board.find().sort({ order: 1 });
    ok(res, result);
  } catch (error) {
    serverError(res);
  }
};

export const createBoard: RequestHandler = async (req, res) => {
  const validReq = createBoardSchema.safeParse(req.body);
  // console.log(validObject)

  if (!validReq.success) {
    return badRequest(res, validReq.error.message);
  }

  try {
    const result = await Board.create(validReq.data);
    ok(res, result);
  } catch (error) {
    serverError(res);
  }
};

export const updateBoard: RequestHandler = async (req, res) => {
  const validReq = createBoardSchema.safeParse(req.body);
  // console.log('update', validObject)

  if (!validReq.success) {
    return badRequest(res, validReq.error.message);
  }

  const query = { _id: new ObjectId(req.params.id) };

  try {
    const result = await Board.findOneAndUpdate(query, validReq.data);
    ok(res, result);
  } catch (error) {
    serverError(res);
  }
};

export const deleteBoard: RequestHandler = async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const result = await Board.findOneAndDelete(query);
    ok(res, result);
  } catch (error) {
    serverError(res);
  }
};
