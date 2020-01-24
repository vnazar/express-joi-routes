import { Routes, Method, ContainerTypes } from '../../src';
import { ClassController } from './classController';
import * as ModuleController from './moduleController';
import Joi from '@hapi/joi';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const routes1: Routes = [
  {
    route: '/foo',
    method: Method.Get,
    controller: ClassController,
    handler: 'getOne',
  },
  {
    route: '/foo/:id',
    method: Method.Delete,
    controller: ModuleController,
    handler: 'deleteOne',
  },
];

const schemaA: Joi.ObjectSchema = Joi.object({
  attrA: Joi.string().required(),
  attrB: Joi.string().required(),
});

const mw1: RequestHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};

const mw2: RequestHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};

export const routes2: Routes = [
  {
    route: '/foo',
    method: Method.Get,
    controller: ClassController,
    handler: 'getOne',
    middlewares: [mw1],
  },
  {
    route: '/foo/:id',
    method: Method.Post,
    controller: ModuleController,
    handler: 'postOne',
    middlewares: [mw1],
    validators: [{ type: ContainerTypes.Body, schema: schemaA }],
  },
];

const routes3Child1Child: Routes = [
  {
    route: '/bar',
    method: Method.Post,
    controller: ModuleController,
    handler: 'postOne',
    validators: [{ type: ContainerTypes.Body, schema: schemaA }],
  },
];

const routes3Child1: Routes = [
  {
    route: '/:id',
    subRoutes: routes3Child1Child,
  },
];

const routes3Child2: Routes = [{ route: '/', method: Method.Delete, controller: ModuleController, handler: 'deleteOne' }];

export const routes3: Routes = [
  {
    route: '/foo',
    method: Method.Get,
    controller: ClassController,
    handler: 'getOne',
  },
  { route: '/foo', subRoutes: routes3Child1 },
  { route: '/bar', subRoutes: routes3Child2, middlewares: [mw1, mw2] },
];

export const routeWithWrongMethod: Routes = [
  {
    route: '/foo',
    method: Method.Get,
    controller: ClassController,
    handler: 'wrongMethod',
  },
];
