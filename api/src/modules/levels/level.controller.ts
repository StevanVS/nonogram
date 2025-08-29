import { RequestHandler } from "express";
import { badRequest, ok, serverError } from "../../utils/request";
import { Board } from "../boards/board.model";
import { getLevelsSchema } from "./level.validation";

export const getLevels: RequestHandler = async (req, res) => {
  const validReq = getLevelsSchema.safeParse(req.body);
  if (!validReq.success) {
    return badRequest(res, validReq.error.message);
  }

  const completedLevels: string[] = validReq.data.completedLevels || [];

  try {
    const result = await Board.find().sort({ order: 1 });

    const levels = result.map((b) => {
      const complete = completedLevels.includes(b.id);
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
