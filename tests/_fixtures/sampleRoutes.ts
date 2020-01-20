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
    controller: ClassController,
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
    route: '/fooa/:id',
    method: Method.Post,
    controller: ModuleController,
    function: 'postOne',
    middlewares: [mw1],
    validators: [{ type: ContainerTypes.Body, schema: schemaA }],
  },
];

export const basicModuleRoute: Routes = [
  {
    route: '/foo',
    method: Method.Get,
    controller: ModuleController,
    function: 'getBasic',
  },
];

const nestedRoutesChild: Routes = [
  {
    route: '/bar',
    method: Method.Get,
    controller: ClassController,
    function: 'getBasic',
  },
];

export const nestedRoutes: Routes = [{ route: '/foo', subRoutes: nestedRoutesChild }];

export const routeWithWrongMethod: Routes = [
  {
    route: '/foo',
    method: Method.Get,
    controller: ClassController,
    function: 'wrongMethod',
  },
];
