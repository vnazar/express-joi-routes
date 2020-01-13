import { ExpressAwesomeRoutes } from '../src';
import * as sampleRoutes from './_fixtures/sampleRoutes';
import request, { Response as SuperTestResponse } from 'supertest';
import express, { Express, Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

describe('ExpressAwesomeRoutes', () => {
  describe('add', () => {
    it('Add a simple route (first level route and without validations and middlewares)', () => {
      const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();

      ear.add(sampleRoutes.basicRoute);

      // const r: Router = ear.getRoutes();
      // console.log(r.stack[0]);
      // expect(r.stack[0].route.stack[0].method).toEqual('post');
      const app: Express = express();
      app.use(bodyParser.json());
      const router: Router = Router();
      router.get('/bar', (req: Request, res: Response) => {
        res.json({ message: 'ok' });
      });
      app.use(router);
      app.use(ear.getRoutes());

      request(app)
        .get('/foo')
        .then((value: SuperTestResponse): void => {
          expect(value.body).toEqual({ message: 'ok' });
        });
    });
  });
});
