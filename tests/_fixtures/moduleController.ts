import { Request, Response } from 'express';

export function postOne(_req: Request, res: Response): void {
  res.status(200).json({ message: 'ok' });
}
