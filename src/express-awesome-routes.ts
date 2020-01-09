import { Request, Response, NextFunction, RequestHandler, Router } from 'express';
import { createValidator, ExpressJoiInstance } from 'express-joi-validation';
import Joi from '@hapi/joi';

export enum ContainerTypes {
  Body = 'body',
  Query = 'query',
  Headers = 'headers',
  Fields = 'fields',
  Params = 'params',
}

export enum RouterHandlers {
  Get = 'get',
  Post = 'post',
  Delete = 'delete',
  Head = 'head',
  Options = 'options',
  Trace = 'trace',
  Copy = 'copy',
  Lock = 'lock',
  Mkcol = 'mkcol',
  Move = 'move',
  Purge = 'purge',
  Propfind = 'propfind',
  Proppatch = 'proppatch',
  Unlock = 'unlock',
  Report = 'report',
  Mkactivity = 'mkactivity',
  Checkout = 'checkout',
  Merge = 'merge',
  MSearch = 'm-search',
  Notify = 'notify',
  Subscribe = 'subscribe',
  Unsubscribe = 'unsubscribe',
  Batch = 'patch',
  Search = 'search',
  Connect = 'connect',
}

type ValidationTypes = ContainerTypes.Body | ContainerTypes.Fields | ContainerTypes.Headers | ContainerTypes.Params | ContainerTypes.Query;

interface ValidatorOpts {
  type: ValidationTypes;
  schema: Joi.Schema;
}

/**
 *
 *
 * @interface BaseRoute
 */
interface BaseRoute {
  route: string;
  middlewares?: RequestHandler[];
}
interface Route extends BaseRoute {
  routerHandler: RouterHandlers;
  controller: any;
  method: string;
  validators?: ValidatorOpts[];
}

interface ProxyRoute extends BaseRoute {
  subRoutes: Routes;
}

type Routes = Array<Route | ProxyRoute>;

function _isDefined<T>(val: T | undefined | null): val is T {
  return typeof (val as T) !== 'undefined' && typeof (val as T) !== null;
}

export class ExpressAwesomeRoutes {
  private readonly _router: Router;
  public constructor() {
    this._router = Router();
  }

  private _routerHandler(controller: any, method: string): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      const result: any = new controller()[method](req, res, next);
      if (result instanceof Promise) {
        result.then((result: any) => (_isDefined(result) ? res.send(result) : next()));
      } else if (_isDefined(result)) {
        res.json(result);
      }
    };
  }

  private _createRoutePath(prefix: string, path: string): string {
    return prefix + path;
  }

  private _isRoute(val: Route | ProxyRoute): val is Route {
    return (val as Route).routerHandler !== undefined;
  }

  private _isProxyRoute(val: Route | ProxyRoute): val is ProxyRoute {
    return (val as ProxyRoute).subRoutes !== undefined;
  }

  /**
   * Load routes recursively.
   *
   * @private
   * @param {Routes} routes
   * @param {Router} router
   * @param {string} [path]
   * @param {any[]} [middlewares]
   * @memberof ExpressAwesomeRoutes
   */
  private _loadRoutes(routes: Routes, router: Router, path?: string, middlewares?: any[]): void {
    routes.forEach((route: Route | ProxyRoute) => {
      const parentMiddlewares: any[] = _isDefined(middlewares) ? middlewares : [];
      const currentMiddlewares: any[] = _isDefined(route.middlewares) ? route.middlewares : [];
      const allMiddlewares: any[] = parentMiddlewares.concat(currentMiddlewares);
      const fullPath: string = _isDefined(path) ? this._createRoutePath(path, route.route) : route.route;

      if (this._isRoute(route)) {
        const validator: ExpressJoiInstance = createValidator();
        const validatorsOpts: ValidatorOpts[] = _isDefined(route.validators) ? route.validators : [];
        const validatorHandlers: RequestHandler[] = validatorsOpts.map((validatorOpts: ValidatorOpts) => {
          return validator[validatorOpts.type](validatorOpts.schema);
        });
        this._router[route.routerHandler](
          fullPath,
          ...allMiddlewares,
          ...validatorHandlers,
          this._routerHandler(route.controller, route.routerHandler),
        );
      } else if (this._isProxyRoute(route)) {
        this._loadRoutes(route.subRoutes, router, fullPath, allMiddlewares);
      }
    });
  }

  public create(routes: Routes): Router;
  public create(routes: Routes, prefix: string): Router;
  public create(routes: Routes, prefix: string, middlewares: any[]): Router;
  public create(routes: Routes, prefix?: string, middlewares?: any[]): Router {
    const router: Router = Router();
    // const validator: ExpressJoiInstance = createValidator({ passError: true });
    this._loadRoutes(routes, router, prefix, middlewares);
    return this._router;
  }
}

export function createRoutes(routes: Routes): Router;
export function createRoutes(routes: Routes, prefix: string): Router;
export function createRoutes(routes: Routes, prefix: string, middlewares: any[]): Router;
export function createRoutes(routes: Routes, prefix?: string, middlewares?: any[]): Router {
  const expressAwesomeRoutes: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
  if (middlewares !== undefined && prefix !== undefined) {
    return expressAwesomeRoutes.create(routes, prefix, middlewares);
  } else if (prefix !== undefined) {
    return expressAwesomeRoutes.create(routes, prefix);
  } else {
    return expressAwesomeRoutes.create(routes);
  }
}
