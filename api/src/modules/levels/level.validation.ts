import { z } from "zod";

export const getLevelsSchema = z.object({
  games: z
    .array(z.object({ boardId: z.string(), gameTiles: z.array(z.number()) }))
    .optional()
    .nullish(),
});
