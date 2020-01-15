import { Routes, ExpressRouterHandlers } from '../../src';
import { ClassController } from './classController';
import * as ModuleController from './moduleController';

export const basicClassRoute: Routes = [
  {
    route: '/foo',
    routerHandler: ExpressRouterHandlers.Get,
    controller: ClassController,
    method: 'getOne',
  },
  {
    route: '/foo',
    routerHandler: ExpressRouterHandlers.Get,
    controller: ClassController,
    method: 'getOneAsync',
  },
  {
    route: '/foo',
    routerHandler: ExpressRouterHandlers.Post,
    controller: ModuleController,
    method: 'postOne',
  },
  {
    route: '/foo/:id',
    routerHandler: ExpressRouterHandlers.Delete,
    controller: ClassController,
    method: 'deleteOne',
  },
  {
    route: '/foo/:id',
    routerHandler: ExpressRouterHandlers.Put,
    controller: ClassController,
    method: 'putOne',
  },
];

export const basicModuleRoute: Routes = [
  {
    route: '/foo',
    routerHandler: ExpressRouterHandlers.Get,
    controller: ModuleController,
    method: 'getBasic',
  },
];

const nestedRoutesChild: Routes = [
  {
    route: '/bar',
    routerHandler: ExpressRouterHandlers.Get,
    controller: ClassController,
    method: 'getBasic',
  },
];

export const nestedRoutes: Routes = [{ route: '/foo', subRoutes: nestedRoutesChild }];

export const routeWithWrongMethod: Routes = [
  {
    route: '/foo',
    routerHandler: ExpressRouterHandlers.Get,
    controller: ClassController,
    method: 'wrongMethod',
  },
];
