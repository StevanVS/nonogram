import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).trim(),
  email: z.email().min(4),
  password: z.string().min(8).max(20),
});

export const loginSchema = z.object({
  email: z.email().min(4),
  password: z.string().min(8).max(20),
});
