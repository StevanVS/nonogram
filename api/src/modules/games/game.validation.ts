import { z } from "zod";

export const getGameSchema = z.object({
  gameTiles: z.array(z.number()),
  history: z.array(z.any()),
});
