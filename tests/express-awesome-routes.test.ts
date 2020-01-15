import { ExpressAwesomeRoutes } from '../src';
import * as sampleRoutes from './_fixtures/sampleRoutes';
import request, { Response } from 'supertest';
import express, { Express } from 'express';
import { Router } from 'express';

// Globals
let app: Express;

describe('ExpressAwesomeRoutes', () => {
  describe('+add()', () => {
    beforeEach(() => {
      app = express();
    });

    it('load a simple route (first level route, without validations nor middlewares) succesfully.', () => {
      const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
      ear.add(sampleRoutes.basicClassRoute);
      const routes: Router = ear.getRoutes();
      app.use(routes);

      // GetOne
      // router handler
      expect(routes.stack[0].route.stack[0].method).toEqual('get');
      // route path
      expect(routes.stack[0].route.path).toEqual('/foo');
      // handler type
      expect(typeof routes.stack[0].route.stack[0].handle).toEqual('function');
      // handler name
      expect(routes.stack[0].route.stack[0].name).toEqual('getOne');

      // GetOneAsync
      // router handler
      expect(routes.stack[1].route.stack[0].method).toEqual('get');
      // route path
      expect(routes.stack[1].route.path).toEqual('/foo');
      // handler type
      expect(typeof routes.stack[1].route.stack[0].handle).toEqual('function');
      // handler name
      expect(routes.stack[1].route.stack[0].name).toEqual('getOneAsync');

      // PostOne
      // router handler
      expect(routes.stack[2].route.stack[0].method).toEqual('post');
      // route path
      expect(routes.stack[2].route.path).toEqual('/foo');
      // handler type
      expect(typeof routes.stack[2].route.stack[0].handle).toEqual('function');
      // handler name
      expect(routes.stack[2].route.stack[0].name).toEqual('postOne');

      // DeleteOne
      // router handler
      expect(routes.stack[3].route.stack[0].method).toEqual('delete');
      // route path
      expect(routes.stack[3].route.path).toEqual('/foo/:id');
      // handler type
      expect(typeof routes.stack[3].route.stack[0].handle).toEqual('function');
      // handler name
      expect(routes.stack[3].route.stack[0].name).toEqual('deleteOne');
      // path param
      expect(routes.stack[3].keys[0].name).toEqual('id');

      // PutOne
      // router handler
      expect(routes.stack[4].route.stack[0].method).toEqual('put');
      // route path
      expect(routes.stack[4].route.path).toEqual('/foo/:id');
      // handler type
      expect(typeof routes.stack[4].route.stack[0].handle).toEqual('function');
      // handler name
      expect(routes.stack[4].route.stack[0].name).toEqual('putOne');
      // path param
      expect(routes.stack[4].keys[0].name).toEqual('id');
    });

    // it('load a simple route  with a controller Module (first level route, without validations nor middlewares) succesfully.', () => {
    //   const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
    //   ear.add(sampleRoutes.basicModuleRoute);
    //   const routes: Router = ear.getRoutes();
    //   app.use(routes);

    //   // router handler
    //   expect(routes.stack[0].route.stack[0].method).toEqual('get');
    //   // route path
    //   expect(routes.stack[0].route.path).toEqual('/foo');
    //   // handler type
    //   expect(typeof routes.stack[0].route.stack[0].handle).toEqual('function');
    //   // handler name
    //   expect(routes.stack[0].route.stack[0].name).toEqual('getBasic');
    // });

    // it('make a request to a simple route (first level route, without validations nor middlewares) successfully.', () => {
    //   const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
    //   ear.add(sampleRoutes.basicClassRoute);
    //   const routes: Router = ear.getRoutes();
    //   app.use(routes);

    //   return request(app)
    //     .get('/foo')
    //     .expect(200)
    //     .then((response: Response) => {
    //       expect(response.body).toEqual({ message: 'ok' });
    //     });
    // });

    // it('add a simple route with wrong controller method and throw an exception error.', () => {
    //   const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
    //   expect(() => {
    //     ear.add(sampleRoutes.routeWithWrongMethod);
    //   }).toThrowError();
    // });

    // it('load a nested route (two levels route, without validations nor middlewares) successfully.', () => {
    //   const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
    //   ear.add(sampleRoutes.nestedRoutes);
    //   const routes: Router = ear.getRoutes();
    //   app.use(routes);

    //   // router handler
    //   expect(routes.stack[0].route.stack[0].method).toEqual('get');
    //   // route path
    //   expect(routes.stack[0].route.path).toEqual('/foo/bar');
    //   // handler type
    //   expect(typeof routes.stack[0].route.stack[0].handle).toEqual('function');
    //   // handler name
    //   expect(routes.stack[0].route.stack[0].name).toEqual('getBasic');
    // });

    // it('make a request to a nested route (two levels route, without validations nor middlewares) successfully.', () => {
    //   const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
    //   ear.add(sampleRoutes.nestedRoutes);
    //   const routes: Router = ear.getRoutes();
    //   app.use(routes);

    //   return request(app)
    //     .get('/foo/bar')
    //     .expect(200)
    //     .then((response: Response) => {
    //       expect(response.body).toEqual({ message: 'ok' });
    //     });
    // });
  });
});
