import { RequestHandler } from "express";
import db from "../../config/mongodb";
import { notFound, ok, serverError } from "../../utils/request";

export const getLevels: RequestHandler = async (req, res) => {
  try {
    // TODO: filter only has level
    const boards = await db.collection("boards").find().toArray();

    //TODO: sort boards by level

    const levels = boards.map((b) => ({
      level: b.level,
      boardId: b._id,
      coloredTiles: b.coloredTiles,
    }))

    ok(res, levels);
  } catch (error) {
    serverError(res, error);
  }
};
