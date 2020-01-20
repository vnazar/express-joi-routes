import { RequestHandler, Router } from 'express';
import { createValidator, ExpressJoiInstance, ExpressJoiConfig, ExpressJoiContainerConfig } from 'express-joi-validation';
import { ObjectSchema } from '@hapi/joi';

/**
 * Contain ContainerTypes defined in express-joi-validation library.
 *
 * @export
 * @enum {number}
 */
export enum ContainerTypes {
  Body = 'body',
  Query = 'query',
  Headers = 'headers',
  Fields = 'fields',
  Params = 'params',
}

/**
 * Contain RouterHandlers options defined in express 4.x.x.
 *
 * @export
 * @enum {number}
 */
export enum Method {
  All = 'all',
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Patch = 'patch',
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
  Search = 'search',
  Connect = 'connect',
}

export interface ValidatorOpts {
  type: ContainerTypes;
  schema: ObjectSchema;
  opts?: ExpressJoiContainerConfig;
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

export interface Route extends BaseRoute {
  method: Method;
  controller: any;
  function: string;
  validators?: ValidatorOpts[];
}

export interface ProxyRoute extends BaseRoute {
  subRoutes: Routes;
}

export type Routes = Array<Route | ProxyRoute>;

function _isDefined<T>(val: T | undefined | null): val is T {
  return typeof (val as T) !== 'undefined' && typeof (val as T) !== null;
}
export class ExpressAwesomeRoutes {
  private readonly _router: Router;
  private readonly _joiOpts: ExpressJoiConfig;

  public constructor(joiOpts?: ExpressJoiConfig) {
    this._joiOpts = joiOpts || {};
    this._joiOpts.passError = joiOpts?.passError || false;
    this._joiOpts.statusCode = joiOpts?.statusCode || 400;
    this._router = Router();
  }

  private _createRoutePath(prefix: string, path: string): string {
    return prefix + path;
  }

  private _isRoute(val: Route | ProxyRoute): val is Route {
    return (val as Route).method !== undefined;
  }

  private _isProxyRoute(val: Route | ProxyRoute): val is ProxyRoute {
    return (val as ProxyRoute).subRoutes !== undefined;
  }

  private _hasConstructor(obj: any): boolean {
    try {
      new obj();
      return true;
    } catch (error) {
      return false;
    }
  }

  private _joinMiddlewares(prevMiddlewares: RequestHandler[] | undefined, newMiddlewares: RequestHandler[] | undefined): RequestHandler[] {
    const prevMw: RequestHandler[] = _isDefined(prevMiddlewares) ? prevMiddlewares : [];
    const newMw: RequestHandler[] = _isDefined(newMiddlewares) ? newMiddlewares : [];
    const catMw: RequestHandler[] = prevMw.concat(newMw);
    return catMw;
  }

  private _generateValidatorsHandlers(validatorsOpts: ValidatorOpts[] | undefined): RequestHandler[] {
    const joiValidator: ExpressJoiInstance = createValidator(this._joiOpts);
    const vOpts: ValidatorOpts[] = _isDefined(validatorsOpts) ? validatorsOpts : [];
    const validatorHandlers: RequestHandler[] = vOpts.map((validatorOpts: ValidatorOpts) =>
      joiValidator[validatorOpts.type](validatorOpts.schema),
    );
    return validatorHandlers;
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
  private _loadRoutes(routes: Routes, router: Router, path?: string, middlewares?: RequestHandler[]): void {
    routes.forEach((route: Route | ProxyRoute) => {
      const mw: RequestHandler[] = this._joinMiddlewares(middlewares, route.middlewares);
      const fullPath: string = _isDefined(path) ? this._createRoutePath(path, route.route) : route.route;

      if (this._isRoute(route)) {
        try {
          const validatorsHandlers: RequestHandler[] = this._generateValidatorsHandlers(route.validators);
          const ctrl: any = this._hasConstructor(route.controller) ? new route.controller() : route.controller;
          this._router[route.method](fullPath, ...mw, ...validatorsHandlers, ctrl[route.function]);
        } catch (error) {
          throw new Error(error);
        }
      } else if (this._isProxyRoute(route)) {
        this._loadRoutes(route.subRoutes, router, fullPath, mw);
      }
    });
  }

  public add(routes: Routes): void;
  public add(routes: Routes, prefix: string): void;
  public add(routes: Routes, prefix: string, middlewares: any[]): void;
  public add(routes: Routes, prefix?: string, middlewares?: any[]): void {
    const router: Router = Router();
    this._loadRoutes(routes, router, prefix, middlewares);
  }

  public getRoutes(): Router {
    return this._router;
  }
}

export function createRoutes(routes: Routes): Router;
export function createRoutes(routes: Routes, prefix: string): Router;
export function createRoutes(routes: Routes, prefix: string, middlewares: any[]): Router;
export function createRoutes(routes: Routes, prefix?: string, middlewares?: any[]): Router {
  const expressAwesomeRoutes: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();

  if (middlewares !== undefined && prefix !== undefined) {
    expressAwesomeRoutes.add(routes, prefix, middlewares);
    return expressAwesomeRoutes.getRoutes();
  } else if (prefix !== undefined) {
    expressAwesomeRoutes.add(routes, prefix);
    return expressAwesomeRoutes.getRoutes();
  } else {
    expressAwesomeRoutes.add(routes);
    return expressAwesomeRoutes.getRoutes();
  }
}

export { ExpressJoiContainerConfig };
