import { z } from "zod";

export const getGameSchema = z.object({
  game: z
    .object({
      boardId: z.string(),
      gameTiles: z.array(z.number()),
      history: z.array(z.any()),
    })
    .optional()
    .nullish(),
});

export const saveGameSchema = z.object({
  game: z.object({
    boardId: z.string(),
    gameTiles: z.array(z.number()),
    history: z.array(z.any()),
  }),
});
