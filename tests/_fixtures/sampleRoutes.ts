import { Routes, ExpressRouterHandlers } from '../../src';
import { FooController } from './sample-controller';

export const basicRoute: Routes = [
  {
    route: '/foo',
    routerHandler: ExpressRouterHandlers.Get,
    controller: FooController,
    method: 'getBasic',
  },
];

const nestedRoutesChild: Routes = [
  {
    route: '/bar',
    routerHandler: ExpressRouterHandlers.Post,
    controller: FooController,
    method: 'getBasic',
  },
];

export const nestedRoutes: Routes = [{ route: '/foo', subRoutes: nestedRoutesChild }];
