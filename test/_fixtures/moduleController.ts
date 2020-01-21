import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { BodySchema, PostOneSchema } from './interfaces';

export function getOne(_req: Request, res: Response): void {
  res.status(200).json({ message: 'ok' });
}

export function postOne(_req: ValidatedRequest<BodySchema<PostOneSchema>>, res: Response): void {
  res.status(200).json({ message: 'ok' });
}

export function deleteOne(_req: Request, res: Response): void {
  res.status(200).json({ message: 'ok' });
}

export function putOne(_req: ValidatedRequest<BodySchema<PostOneSchema>>, res: Response): void {
  res.status(200).json({ message: 'ok' });
}
