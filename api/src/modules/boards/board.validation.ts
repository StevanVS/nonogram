import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string().min(3).trim(),
  width: z.int().positive(),
  height: z.int().positive(),
  filledTiles: z.array(z.int()),
  coloredTiles: z.array(z.string()),
  order: z
    .int()
    .min(0)
    .nullable()
    .transform((value) => value ?? 0),
  subGrid: z
    .int()
    .min(0)
    .nullable()
    .transform((value) => value ?? 0),
});
