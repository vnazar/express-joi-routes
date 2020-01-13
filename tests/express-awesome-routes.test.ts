import { ExpressAwesomeRoutes, Route } from '../src';
import * as sampleRoutes from './_fixtures/sampleRoutes';
import request, { Response } from 'supertest';
import express, { Express } from 'express';
import { Router } from 'express';

// Globals
let app: Express;

describe('add', () => {
  describe('add', () => {
    beforeEach(() => {
      app = express();
    });

    it('add a simple route (first level route and without validations and middlewares) and respond successfully', () => {
      const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
      ear.add(sampleRoutes.basicRoute);
      const routes: Router = ear.getRoutes();
      app.use(routes);

      const expectedRouterHandler: string = 'get';
      const expectedRoutePath: string = '/foo';

      // ASSSERTS
      // Method
      expect(routes.stack[0].route.stack[0].method).toEqual(expectedRouterHandler);
      // Route path is ok
      expect(routes.stack[0].route.path).toEqual(expectedRoutePath);
      // Function handler type
      expect(typeof routes.stack[0].route.stack[0].handle).toEqual('function');
      return request(app)
        .get('/foo')
        .then((response: Response) => {
          expect(response.body).toEqual({ message: 'ok' });
        });
    });
    it('add a simple route with wrong controller method and return an exception.', () => {
      const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
      ear.add(sampleRoutes.routeWithWrongMethod);
      const routes: Router = ear.getRoutes();
      app.use(routes);

      const expectedRouterHandler: string = 'get';
      const expectedRoutePath: string = '/foo';

      //   console.log(routes.stack[0].route.stack[0]);
      // ASSSERTS
      // Method
      expect(routes.stack[0].route.stack[0].method).toEqual(expectedRouterHandler);
      // Route path is ok
      expect(routes.stack[0].route.path).toEqual(expectedRoutePath);
      // Function handler type
      expect(typeof routes.stack[0].route.stack[0].handle).toEqual('function');
      return request(app)
        .get('/foo')
        .expect(500);
    });
    it('add a nested route (two levels route and without validations and middlewares) and respond successfully', () => {
      const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
      ear.add(sampleRoutes.nestedRoutes);
      const routes: Router = ear.getRoutes();
      app.use(routes);
      const expectedRouterHandler: string = 'get';
      const expectedRoutePath: string = '/foo/bar';

      app.use(routes);

      // ASSSERTS
      // Method
      expect(routes.stack[0].route.stack[0].method).toEqual(expectedRouterHandler);
      // Route path is ok
      expect(routes.stack[0].route.path).toEqual(expectedRoutePath);
      // Function handler type
      expect(typeof routes.stack[0].route.stack[0].handle).toEqual('function');
      return request(app)
        .get('/foo/bar')
        .then((response: Response) => {
          expect(response.body).toEqual({ message: 'ok' });
        });
    });
  });
});
