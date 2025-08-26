import { RequestHandler } from "express";
import { badRequest, ok, serverError } from "../../utils/request";
import { Board } from "../boards/board.model";
import { getLevelsSchema } from "./level.validation";

export const getLevels: RequestHandler = async (req, res) => {
  const validObject = getLevelsSchema.safeParse(req.body);
  if (!validObject.success) {
    return badRequest(res, validObject.error.message);
  }

  const completedLevels: string[] = validObject.data.completedLevels || [];

  try {
    const result = await Board.find().sort({ order: 1 });

    const levels = result.map((b) => {
      const complete = completedLevels.includes(b._id.toString());
      return {
        id: b.id,
        order: b.order,
        complete: complete,
        coloredTiles: complete ? b.coloredTiles : [],
        width: b.width,
        height: b.height,
      };
    });

    return ok(res, levels);
  } catch (error) {
    return serverError(res);
  }
};
