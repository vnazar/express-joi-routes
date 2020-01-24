# Express Joi Routes

[![npm version][npm-img]][npm-url]
[![npm downloads][downloads-img]][downloads-url]
[![build status][build-img]][build-url]
[![converage status][coveralls-img]][coveralls-url]
[![license][license-img]][license-url]

Module for Express.js that allows you to standardize your routes and validate their content with [@happi/joi](https://github.com/hapijs/joi).

## Table of Content

- [Express Joi Routes](#express-joi-routes)
  - [Table of Content](#table-of-content)
  - [About](#about)
  - [Features](#features)
  - [Installation](#installation)
  - [Example](#example)
    - [JavaScript](#javascript)
    - [TypeScript](#typescript)
  - [Documentation](#documentation)
    - [Routes definitions](#routes-definitions)
      - [Route](#route)
      - [ProxyRoute](#proxyroute)
      - [Routes](#routes)
      - [Example](#example-1)
    - [ValidationOptions](#validationoptions)
    - [Method](#method)
    - [ContainerTypes](#containertypes)
    - [ExpressJoiRoutes([options])](#expressjoiroutesoptions)
      - [Arguments (Typed)](#arguments-typed)
      - [Example](#example-2)
      - [add(routes[,prefix][,middlewares])](#addroutesprefix)
        - [Arguments (Typed)](#arguments-typed-1)
        - [Example](#example-3)
      - [getRoutes()](#getroutes)
        - [Example](#example-4)
    - [createRoutes(routes[,prefix][,middlewares])](#createroutesroutesprefix)
      - [Arguments (Typed)](#arguments-typed-2)
      - [Example](#example-5)
  - [License](#license)

## About

The motivation to use this package is improve the maintainability of your code and facilitate DRY (Don't repeat yourself) principle in your routes.

## Features

This library support the following features:

- Create **routes**.
- Add **middleware(s)** to routes.
- Add **Joi validators (@happi/joi)** to routes.
- Set prefix to your routes.

## Installation

```bash
npm i --save express-joi-routes
```

## Example

Here is an example to use **express-joi-routes** in the simplest way.

### JavaScript

```js
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { createRoutes, Method } = require('express-joi-routes');

class Controller {
  getOne(_req, res) {
    res.json({
      message: 'ok',
    });
  }
}

app.use(bodyParser.json());

const routes = [
  {
    route: '/foo',
    method: Method.Get,
    controller: Controller,
    handler: 'getOne',
  },
];

app.use(createRoutes(routes));
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
```

### TypeScript

```ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { createRoutes, Method, Routes } from 'express-joi-routes';

class Controller {
  public getOne(_req: Request, res: Response): void {
    res.json({
      message: 'ok',
    });
  }
}

const app: express.Express = express();
app.use(bodyParser.json());

const routes: Routes = [
  {
    route: '/foo',
    method: Method.Get,
    controller: Controller,
    handler: 'getOne',
  },
];

app.use(createRoutes(routes));
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
```

## Documentation

### Routes definitions

In **Express Joi Routes** you can build your own routes using defined objects. The composition of these objects allows to you implement your routes with the flexibility as you want.

#### Route

```ts
export interface Route {
  route: string;
  method: Method;
  controller: any;
  handler: string;
  middlewares?: RequestHandler[];
  validators?: ValidatorOptions[];
}
```

#### ProxyRoute

```ts
export interface ProxyRoute {
  route: string;
  subRoutes: Routes;
  middlewares?: RequestHandler[];
}
```

#### Routes

```ts
type Routes = Array<Route | ProxyRoute>;
```

#### Example

```ts
import { Routes, Method } from 'express-joi-routes';
import { FooController } from 'controllers';

const fooRoutes: Routes = [
  {
    route: '',
    method: Method.Post,
    controller: FooController,
    handler: 'postOne',
  },
  {
    route: '/:id',
    method: Method.Get,
    controller: FooController,
    handler: 'getOne',
  },
];

const mainRoutes: Routes = [
  {
    route: '/foo',
    subRoutes: fooRoutes,
  },
];

// Equivalent to:
// POST   /foo
// GET    /foo/:id
```

### ValidationOptions

```ts
interface ValidatorOptions {
  type: ContainerTypes;
  schema: ObjectSchema;
  opts?: ExpressJoiContainerConfig;
}
```

### Method

Object (enum in TS) that includes all HTTP methods (supported by [express.js 4.x](https://expressjs.com/en/4x/api.html#app.METHOD)).

```ts
Method.All;
Method.Get;
Method.Post;
Method.Put;
Method.Patch;
Method.Delete;
Method.Head;
Method.Options;
Method.Trace;
Method.Copy;
Method.Lock;
Method.Mkcol;
Method.Move;
Method.Purge;
Method.Profind;
Method.Proppatch;
Method.Unlock;
Method.Report;
Method.Mkactivity;
Method.Checkout;
Method.Merge;
Method.MSearch;
Method.Notify;
Method.Subscribe;
Method.Unsubscribe;
Method.Search;
Method.Connnect;
```

### ContainerTypes

Object (enum in TS) that includes the validation types (see [express-joi-validation](https://www.npmjs.com/package/express-joi-validation)).

```ts
ContainerTypes.Body;
ContainerTypes.Query;
ContainerTypes.Headers;
ContainerTypes.Fields;
ContainerTypes.Params;
```

### ExpressJoiRoutes([options])

Class that instance a ExpressJoiRoutes object allowing to you pass a set of options to configure it.

##### Arguments (Typed)

```ts
ExpressJoiRoutes();
ExpressJoiRoutes(options: ExpressJoiRoutesOptions);
```

| ExpressJoiRoutesOptions | Description                                                                                                                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| joiPassError            | Equivalent to [passError](https://www.npmjs.com/package/express-joi-validation#createvalidatorconfig) option of [express-joi-validation](https://www.npmjs.com/package/express-joi-validation) package.  |
| joiStatusCode           | Equivalent to [statusCode](https://www.npmjs.com/package/express-joi-validation#createvalidatorconfig) option of [express-joi-validation](https://www.npmjs.com/package/express-joi-validation) package. |

##### Example

```ts
import { ExpressJoiRoutes } from 'express-joi-routes';

// With default options
const ejr: ExpressJoiRoutes = new ExpressJoiRoutes();
// With options
const ejr: ExpressJoiRoutes = new ExpressJoiRoutes({ passError: true, statusCode: 500 });
```

#### add(routes[,prefix][,middlewares])

Method that add(s) route(s) to `Router` object (Express.js `Router`), passing the following arguments:

##### Arguments (Typed)

```ts
add(routes: Routes): void
add(routes: Routes, prefix: string): void
add(routes: Routes, prefix: string, middlewares: any[]): void
```

| Argument    | Type             | Optional | Description                                        |
| ----------- | ---------------- | -------- | -------------------------------------------------- |
| routes      | Routes           | no       | Array with route configurations.                   |
| prefix      | string           | yes      | Prefix of all routes that you pass. Ex.: `/api/v1` |
| middlewares | RequestHandler[] | yes      | Array of middleware handlers.                      |

##### Example

```ts
import { ExpressJoiRoutes, Method } from 'express-joi-routes';
// imports...
const ejr: ExpressJoiRoutes = new ExpressJoiRoutes();
const routes: Routes = [
  {
    route: 'foo',
    method: Method.Get,
    controller: ControllerClass,
    handler: 'getOne',
  },
];

ejr.add(routes, '/api/v1');
```

#### getRoutes()

Method that return a `Router` object (Express.js `Router`) with the routes added by `add` method.

##### Example

```ts
const router: Router = ejr.getRoutes();
app.use(router);
```

### createRoutes(routes[,prefix][,middlewares])

Function that under the hood utilize [ExpressJoiRoutes]() class to create and get routes (`Router`) without call the above methods.

##### Arguments (Typed)

```ts
add(routes: Routes): Router
add(routes: Routes, prefix: string): Router
add(routes: Routes, prefix: string, middlewares: any[]): Router
```

| Argument    | Type             | Optional | Description                                        |
| ----------- | ---------------- | -------- | -------------------------------------------------- |
| routes      | Routes           | no       | Array with route configurations.                   |
| prefix      | string           | yes      | Prefix of all routes that you pass. Ex.: `/api/v1` |
| middlewares | RequestHandler[] | yes      | Array of middleware handlers.                      |

##### Example

```ts
import { createRoutes, Method } from 'express-joi-routes';
// imports, express instance, etc.

const routes: Routes = [
  {
    route: 'foo',
    method: Method.Get,
    controller: ControllerClass,
    handler: 'getOne',
  },
];

const router: Router = createRoutes(routes);
app.use(router);
```

## License

[MIT](LICENSE)

[npm-img]: https://img.shields.io/npm/v/express-joi-routes.svg?color=red
[npm-url]: https://www.npmjs.com/package/express-joi-routes
[downloads-img]: https://img.shields.io/npm/dm/express-joi-routes.svg
[downloads-url]: https://www.npmjs.com/package/express-joi-routes
[build-img]: https://travis-ci.org/vnazar/express-joi-routes.svg?branch=master
[build-url]: https://travis-ci.org/vnazar/express-joi-routes
[coveralls-img]: https://coveralls.io/repos/github/vnazar/express-joi-routes/badge.svg
[coveralls-url]: https://coveralls.io/github/vnazar/express-joi-routes
[license-img]: https://img.shields.io/github/license/vnazar/express-joi-routes.svg?color=blue
[license-url]: https://github.com/vnazar/express-joi-routes/blob/master/LICENSE
