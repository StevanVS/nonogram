import { Response } from "express";

export function ok(res:Response, result?: any) {
  res.status(200).send({ ok: true, datos: result });
}

export function notFound(res: Response, message?: string) {
  res.status(404).json({ ok: false, error: message || "No encontrado" });
}

export function serverError(res: Response, error?: any) {
  console.error(error);
  res.status(500).json({ ok: false, error: error.message || "Error de Servidor" });
}
