import { Request, Response } from 'express';
import { ValidatedRequest, ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';

interface BodySchema<T> extends ValidatedRequestSchema {
  [ContainerTypes.Body]: T;
}

interface PostOneSchema {
  attrA: string;
  attrB: string;
}

export function postOne(req: ValidatedRequest<BodySchema<PostOneSchema>>, res: Response): void {
  res.status(200).json({ message: 'ok' });
}

export function putOne(_req: Request, res: Response): void {
  res.status(200).json({ message: 'ok' });
}
