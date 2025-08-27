import { Response } from "express";

export function ok(res: Response, result?: any) {
  res.status(200).send({ ok: true, datos: result });
}

export function badRequest(res: Response, message?: any) {
  res.status(400).json({ ok: false, error: message || "Bad Request" });
}

export function unauthorized(res: Response, message?: any) {
  res.status(401).json({ ok: false, error: message || "Unauthorized" });
}

export function forbidden(res: Response, message?: any) {
  res.status(403).json({ ok: false, error: message || "Forbidden" });
}

export function notFound(res: Response, message?: any) {
  res.status(404).json({ ok: false, error: message || "Not Found" });
}

export function serverError(res: Response, error?: any) {
  console.error(error);
  res.status(500).json({ ok: false, error: error || "Server Error" });
}
