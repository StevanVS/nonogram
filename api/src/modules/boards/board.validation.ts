import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string().min(3),
  width: z.int().min(1),
  height: z.int().min(1),
  filledTiles: z.array(z.int()),
  coloredTiles: z.array(z.string()),
  order: z.int().min(0).optional(),
  subGrid: z.int().min(0).optional(),
});
