import { Express, Request, Response, NextFunction } from 'express';
import { createValidator, ExpressJoiInstance } from 'express-joi-validation';

interface Validator {
  type: string;
  schema: any;
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

interface Route {
  method: Methods;
  route: string;
  controller: any;
  function: string;
  validators?: Validator[];
}

// const routes: Route[] = [
//   {
//     method: 'post',
//     route: '/configurations',
//     controller: ConfigurationController,
//     function: 'postOne',
//     validators: [{ type: 'body', schema: postOneValidator }],
//   },
//   {
//     method: 'post',
//     route: '/timeseries',
//     controller: TimeSerieController,
//     function: 'postOne',
//   },
// ];

function _isDefined<T>(val: T | undefined | null): val is T {
  return typeof (val as T) !== 'undefined' && typeof (val as T) !== null;
}

function _routerHandler(route: Route, req: Request, res: Response, next: NextFunction): void {
  const result: any = new route.controller()[route.function](req, res, next);
  if (result instanceof Promise) {
    result.then((result: any) => (_isDefined(result) ? res.send(result) : undefined));
  } else if (_isDefined(result)) {
    res.json(result);
  }
}

function _createRoutePath(prefix: string, path: string): string {
  return `${prefix}/${path}`;
}

export function loadRoutes(routes: Route[], prefix: string, app: Express): void {
  //   const validator: ExpressJoiInstance = createValidator({ passError: true });
  routes.forEach((route: Route) => {
    app[route.method](_createRoutePath(prefix, route.route), _routerHandler);
  });
}
