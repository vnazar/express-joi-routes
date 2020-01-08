import { Express, Request, Response, NextFunction, RequestHandler } from 'express';
import { createValidator, ExpressJoiInstance, ContainerTypes } from 'express-joi-validation';
import Joi, { Schema } from '@hapi/joi';

type ValidationTypes = ContainerTypes.Body | ContainerTypes.Fields | ContainerTypes.Headers | ContainerTypes.Params | ContainerTypes.Query;
interface ValidatorOpts {
  type: ValidationTypes;
  schema: Joi.Schema;
}

type Methods =
  | 'get'
  | 'post'
  | 'delete'
  | 'head'
  | 'options'
  | 'trace'
  | 'copy'
  | 'lock'
  | 'mkcol'
  | 'move'
  | 'purge'
  | 'propfind'
  | 'proppatch'
  | 'unlock'
  | 'report'
  | 'mkactivity'
  | 'checkout'
  | 'merge'
  | 'm-search'
  | 'notify'
  | 'subscribe'
  | 'unsubscribe'
  | 'patch'
  | 'search'
  | 'connect';

/**
 *
 *
 * @interface BaseRoute
 */
interface BaseRoute {
  route: string;
  middlewares?: any;
}
interface Route extends BaseRoute {
  method: Methods;
  controller: any;
  function: string;
  validators?: ValidatorOpts[];
}

interface ProxyRoute extends BaseRoute {
  subRoutes: Routes;
}

type Routes = Array<Route | ProxyRoute>;

function _isDefined<T>(val: T | undefined | null): val is T {
  return typeof (val as T) !== 'undefined' && typeof (val as T) !== null;
}

function _routerHandler(route: Route): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result: any = new route.controller()[route.function](req, res, next);
    if (result instanceof Promise) {
      result.then((result: any) => (_isDefined(result) ? res.send(result) : next()));
    } else if (_isDefined(result)) {
      res.json(result);
    }
  };
}

function _createRoutePath(prefix: string, path: string): string {
  return prefix + path;
}

function isRoute(val: Route | ProxyRoute): val is Route {
  return (val as Route).method !== undefined;
}

function isProxyRoute(val: Route | ProxyRoute): val is ProxyRoute {
  return (val as ProxyRoute).subRoutes !== undefined;
}

function _loadRoutes(routes: Routes, app: Express, path?: string, middlewares?: any[]): void {
  routes.forEach((route: Route | ProxyRoute) => {
    const parentMiddlewares: any[] = _isDefined(middlewares) ? middlewares : [];
    const currentMiddlewares: any[] = _isDefined(route.middlewares) ? route.middlewares : [];
    const allMiddlewares: any[] = parentMiddlewares.concat(currentMiddlewares);
    const fullPath: string = _isDefined(path) ? _createRoutePath(path, route.route) : route.route;

    if (isRoute(route)) {
      const validator: ExpressJoiInstance = createValidator();
      console.log(ContainerTypes.Body);
      const validatorsOpts: ValidatorOpts[] = _isDefined(route.validators) ? route.validators : [];
      const validatorHandlers: RequestHandler[] = validatorsOpts.map((validatorOpts: ValidatorOpts) =>
        validator[validatorOpts.type](validatorOpts.schema),
      );
      app[route.method](fullPath, ...allMiddlewares, ...validatorHandlers, _routerHandler(route));
    } else if (isProxyRoute(route)) {
      _loadRoutes(route.subRoutes, app, fullPath, allMiddlewares);
    }
  });
}
export function loadRoutes(routes: Routes, app: Express): void;
export function loadRoutes(routes: Routes, app: Express, prefix: string): void;
export function loadRoutes(routes: Routes, app: Express, prefix: string, middlewares: any[]): void;
export function loadRoutes(routes: Routes, app: Express, prefix?: string, middlewares?: any[]): void {
  // const validator: ExpressJoiInstance = createValidator({ passError: true });
  _loadRoutes(routes, app, prefix, middlewares);
}

//===========================string=============================================

import express from 'express';
const app: Express = express();

class AController {
  public get(_req: Request, res: Response): void {
    res.json({ message: 'A.get' });
  }
  public post(_req: Request, res: Response): void {
    res.json({ message: 'A.post' });
  }
}

class BController {
  public get(_req: Request, res: Response): void {
    res.json({ message: 'B.get' });
  }
  public post(_req: Request, res: Response): void {
    res.json({ message: 'A.post' });
  }
}

const schema: Schema = Joi.object({
  message: Joi.string().required(),
  status: Joi.number().required(),
});

const subRoutesB: Routes = [
  {
    method: 'get',
    route: '/:id',
    controller: BController,
    function: 'get',
    // middlewares: 'middle3()',
  },
];

const routes: Routes = [
  {
    method: 'get',
    route: '/A',
    controller: AController,
    function: 'get',
    middlewares: [
      (req: Request, _res: Response, next: NextFunction): void => {
        console.log(req.query);
        next();
      },
    ],
    validators: [{ type: ContainerTypes.Body, schema: schema }],
  },
  {
    method: 'post',
    route: '/A',
    controller: AController,
    function: 'post',
  },
  {
    route: '/B',
    subRoutes: subRoutesB,
  },
];

loadRoutes(routes, app);
app.listen(3000, () => {
  console.log('Listening on port: 3000');
});
// console.log(app._router.stack);
