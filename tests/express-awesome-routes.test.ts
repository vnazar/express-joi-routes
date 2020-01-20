import { ExpressAwesomeRoutes } from '../src';
import * as sampleRoutes from './_fixtures/sampleRoutes';
import request from 'supertest';
import express, { Express } from 'express';
import { Router } from 'express';
import bodyParser from 'body-parser';

// Globals
let app: Express;

// Based on tests of express-routes-mapper library (https://github.com/aichbauer/express-routes-mapper).
describe('ExpressAwesomeRoutes', () => {
  describe('+add()', () => {
    beforeEach(() => {
      app = express();
      app.use(bodyParser.json());
    });

    it('load a simple route (first level route, without validations nor middlewares) succesfully.', () => {
      const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
      ear.add(sampleRoutes.routes1);
      const routes: Router = ear.getRoutes();
      app.use(routes);

      // Class method export
      // router handler
      expect(routes.stack[0].route.stack[0].method).toEqual('get');
      // route path
      expect(routes.stack[0].route.path).toEqual('/foo');
      // handler type
      expect(typeof routes.stack[0].route.stack[0].handle).toEqual('function');
      // handler name
      expect(routes.stack[0].route.stack[0].name).toEqual('getOne');

      // Module function export
      // router handler
      expect(routes.stack[1].route.stack[0].method).toEqual('post');
      // route path
      expect(routes.stack[1].route.path).toEqual('/foo/:id');
      // path param
      expect(routes.stack[1].keys[0].name).toEqual('id');
      // path param length
      expect(routes.stack[1].keys.length).toEqual(1);
      // handler type
      expect(typeof routes.stack[1].route.stack[0].handle).toEqual('function');
      // handler name
      expect(routes.stack[1].route.stack[0].name).toEqual('postOne');
    });

    it('load a simple route (first level route, with validation and middleware) succesfully.', async () => {
      const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
      ear.add(sampleRoutes.routes2);
      const routes: Router = ear.getRoutes();
      app.use(routes);

      // Class method export
      // router handler
      expect(routes.stack[0].route.stack[0].method).toEqual('get');
      // route path
      expect(routes.stack[0].route.path).toEqual('/foo');
      // middleware handler type
      expect(typeof routes.stack[0].route.stack[0].handle).toEqual('function');
      // middleware handler name
      expect(routes.stack[0].route.stack[0].name).toEqual('mw1');
      // handler type
      expect(typeof routes.stack[0].route.stack[1].handle).toEqual('function');
      // handler name
      expect(routes.stack[0].route.stack[1].name).toEqual('getOne');

      // Module function export
      // router handler
      expect(routes.stack[1].route.stack[0].method).toEqual('post');
      // route path
      expect(routes.stack[1].route.path).toEqual('/foo/:id');
      // path param
      expect(routes.stack[1].keys[0].name).toEqual('id');
      // path param length
      expect(routes.stack[1].keys.length).toEqual(1);
      // middleware handler type
      expect(typeof routes.stack[1].route.stack[0].handle).toEqual('function');
      // middleware handler name
      expect(routes.stack[1].route.stack[0].name).toEqual('mw1');
      // validator handler type
      expect(typeof routes.stack[1].route.stack[1].handle).toEqual('function');
      // validator handler name
      expect(routes.stack[1].route.stack[1].name).toEqual('expressJoiValidator');
      // handler type
      expect(typeof routes.stack[1].route.stack[2].handle).toEqual('function');
      // handler name
      expect(routes.stack[1].route.stack[2].name).toEqual('postOne');

      await request(app)
        .post('/foo/1')
        .send({ attre: 1 })
        .expect(400);

      await request(app)
        .post('/foo/1')
        .send({ attrA: 'foo', attrB: 'bar' })
        .expect(200);
    });

    it('load a complex route (three levels route, without validations nor middlewares) succesfully.', () => {
      const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
      ear.add(sampleRoutes.routes3);
      const routes: Router = ear.getRoutes();
      app.use(routes);

      // Class method export
      // router handler
      expect(routes.stack[0].route.stack[0].method).toEqual('get');
      // route path
      expect(routes.stack[0].route.path).toEqual('/foo');
      // handler type
      expect(typeof routes.stack[0].route.stack[0].handle).toEqual('function');
      // handler name
      expect(routes.stack[0].route.stack[0].name).toEqual('getOne');

      // Module function export
      // router handler
      expect(routes.stack[1].route.stack[0].method).toEqual('post');
      // route path
      expect(routes.stack[1].route.path).toEqual('/foo/:id/bar');
      // path param
      expect(routes.stack[1].keys[0].name).toEqual('id');
      // path param length
      expect(routes.stack[1].keys.length).toEqual(1);
      // handler type
      expect(typeof routes.stack[1].route.stack[0].handle).toEqual('function');
      // handler name
      expect(routes.stack[1].route.stack[0].name).toEqual('postOne');
    });
  });
});
