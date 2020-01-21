import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { BodySchema, PostOneSchema } from './interfaces';

export class ClassController {
  public getOne(_req: Request, res: Response): void {
    res.status(200).json({ message: 'ok' });
  }

  public postOne(_req: ValidatedRequest<BodySchema<PostOneSchema>>, res: Response): void {
    res.status(200).json({ message: 'ok' });
  }

  public deleteOne(_req: Request, res: Response): void {
    res.status(200).json({ message: 'ok' });
  }

  public putOne(_req: ValidatedRequest<BodySchema<PostOneSchema>>, res: Response): void {
    res.status(200).json({ message: 'ok' });
  }
}
