import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { createRoutes, Method, Routes } from '../dist';

class Controller {
  public getOne(_req: Request, res: Response): void {
    res.json({
      message: 'ok',
    });
  }
}

const app: express.Express = express();
app.use(bodyParser.json());

const routes: Routes = [
  {
    route: '/foo',
    method: Method.Get,
    controller: Controller,
    function: 'getOne',
  },
];

app.use(createRoutes(routes));
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
