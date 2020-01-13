import { Request, Response } from 'express';

export class FooController {
  public getBasic(_req: Request, res: Response): void {
    res.status(200).json({ message: 'ok' });
  }

  public async getAsync(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json({ message: 'ok' });
  }
}
