import { RequestHandler } from "express";
import db from "../../config/mongodb";
import { notFound, ok, serverError } from "../../utils/request";

export const getLevels: RequestHandler = async (req, res) => {
  const completedLevels: string[] = req.body.completedLevels || [];
  // console.log(req.cookies);
  try {
    const boards = await db
      .collection("boards")
      .find({ level: { $exists: true } }, { sort: { level: 1 } })
      .toArray();

    const levels = boards.map((b) => {
      const complete = completedLevels.includes(b._id.toString());
      return {
        level: b.level,
        complete: complete,
        coloredTiles: complete ? b.coloredTiles : [],
        width: complete ? b.width : 0,
        height: complete ? b.height : 0,
      };
    });

    ok(res, levels);
  } catch (error) {
    serverError(res, error);
  }
};
