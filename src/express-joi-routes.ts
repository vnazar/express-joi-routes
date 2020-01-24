import { RequestHandler, Router } from 'express';
import { createValidator, ExpressJoiInstance, ExpressJoiContainerConfig } from 'express-joi-validation';
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

export interface ValidatorOptions {
  type: ContainerTypes;
  schema: ObjectSchema;
  opts?: ExpressJoiContainerConfig;
}

export interface Route {
  route: string;
  method: Method;
  controller: any;
  handler: string;
  middlewares?: RequestHandler[];
  validators?: ValidatorOptions[];
}

export interface ProxyRoute {
  route: string;
  subRoutes: Routes;
  middlewares?: RequestHandler[];
}

export type Routes = Array<Route | ProxyRoute>;

function _isDefined<T>(val: T | undefined | null): val is T {
  return typeof (val as T) !== 'undefined' && typeof (val as T) !== null;
}

export interface ExpressJoiRoutesOptions {
  joiPassError?: boolean;
  joiStatusCode?: number;
}

export class ExpressJoiRoutes {
  private readonly _router: Router;
  private readonly _options: ExpressJoiRoutesOptions;

  public constructor(options?: ExpressJoiRoutesOptions) {
    this._options = options || {};
    this._options.joiPassError = options?.joiPassError || false;
    this._options.joiStatusCode = options?.joiStatusCode || 400;
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

  private _generateValidatorsHandlers(validatorsOpts: ValidatorOptions[] | undefined): RequestHandler[] {
    const joiValidator: ExpressJoiInstance = createValidator({
      passError: this._options.joiPassError,
      statusCode: this._options.joiStatusCode,
    });
    const vOpts: ValidatorOptions[] = _isDefined(validatorsOpts) ? validatorsOpts : [];
    const validatorHandlers: RequestHandler[] = vOpts.map((validatorOpts: ValidatorOptions) =>
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
   * @memberof ExpressJoiRoutes
   */
  private _loadRoutes(routes: Routes, router: Router, path?: string, middlewares?: RequestHandler[]): void {
    routes.forEach((route: Route | ProxyRoute) => {
      const mw: RequestHandler[] = this._joinMiddlewares(middlewares, route.middlewares);
      const fullPath: string = _isDefined(path) ? this._createRoutePath(path, route.route) : route.route;

      if (this._isRoute(route)) {
        try {
          const validatorsHandlers: RequestHandler[] = this._generateValidatorsHandlers(route.validators);
          const ctrl: any = this._hasConstructor(route.controller) ? new route.controller() : route.controller;
          this._router[route.method](fullPath, ...mw, ...validatorsHandlers, ctrl[route.handler].bind(ctrl));
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
  const expressJoiRoutes: ExpressJoiRoutes = new ExpressJoiRoutes();

  if (middlewares !== undefined && prefix !== undefined) {
    expressJoiRoutes.add(routes, prefix, middlewares);
    return expressJoiRoutes.getRoutes();
  } else if (prefix !== undefined) {
    expressJoiRoutes.add(routes, prefix);
    return expressJoiRoutes.getRoutes();
  } else {
    expressJoiRoutes.add(routes);
    return expressJoiRoutes.getRoutes();
  }
}

export { ExpressJoiContainerConfig };
