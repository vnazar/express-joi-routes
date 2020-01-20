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
    function: 'getOne',
  },
  {
    route: '/foo/:id',
    method: Method.Post,
    controller: ModuleController,
    function: 'postOne',
  },
];

const schemaA: Joi.ObjectSchema = Joi.object({
  attrA: Joi.string().required(),
  attrB: Joi.string().required(),
});

const mw1: RequestHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};

export const routes2: Routes = [
  {
    route: '/foo',
    method: Method.Get,
    controller: ClassController,
    function: 'getOne',
    middlewares: [mw1],
  },
  {
    route: '/foo/:id',
    method: Method.Post,
    controller: ModuleController,
    function: 'postOne',
    middlewares: [mw1],
    validators: [{ type: ContainerTypes.Body, schema: schemaA }],
  },
];
const routes3ChildChild: Routes = [
  {
    route: '/bar',
    method: Method.Post,
    controller: ModuleController,
    function: 'postOne',
  },
];

const routes3Child: Routes = [
  {
    route: '/:id',
    subRoutes: routes3ChildChild,
  },
];

export const routes3: Routes = [
  {
    route: '/foo',
    method: Method.Get,
    controller: ClassController,
    function: 'getOne',
  },
  { route: '/foo', subRoutes: routes3Child },
];

export const routeWithWrongMethod: Routes = [
  {
    route: '/foo',
    method: Method.Get,
    controller: ClassController,
    function: 'wrongMethod',
  },
];
