import { z } from "zod";

export const getLevelsSchema = z.object({
  completedLevels: z.array(z.string()),
});
