import { Request, Response } from 'express';

export class ClassController {
  public getOne(_req: Request, res: Response): void {
    res.status(200).json({ message: 'ok' });
  }

  public async getOneAsync(_req: Request, res: Response): Promise<void> {
    res.status(200).json({ message: 'ok' });
  }

  public postOne(_req: Request, res: Response): void {
    res.status(200).json({ message: 'ok' });
  }

  public deleteOne(_req: Request, res: Response): void {
    res.status(200).json({ message: 'ok' });
  }

  public putOne(_req: Request, res: Response): void {
    res.status(200).json({ message: 'ok' });
  }
}
