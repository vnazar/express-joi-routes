# Expres Awesome Routes

Package for express.js framework that allow to you santadarize your routes with the flexibility as you want.

## Table of Content

- [Expres Awesome Routes](#expres-awesome-routes)
  - [Table of Content](#table-of-content)
  - [About](#about)
  - [Features](#features)
  - [Example](#example)
    - [JavaScript](#javascript)
    - [TypeScript](#typescript)
  - [Documentation](#documentation)
    - [Routes definitions](#routes-definitions)
      - [Route](#route)
      - [ProxyRoute](#proxyroute)
      - [Routes](#routes)
      - [ValidationOptions](#validationoptions)
      - [Method](#method)
      - [ContainerTypes](#containertypes)
    - [ExpressAwesomeRoutes([options])](#expressawesomeroutesoptions)
        - [Arguments (Typed)](#arguments-typed)
        - [Example](#example-1)
      - [add(routes [, prefix][, middlewares])](#addroutes--prefix)
        - [Arguments (Typed)](#arguments-typed-1)
        - [Example](#example-2)
      - [getRoutes()](#getroutes)
        - [Example](#example-3)
    - [createRoutes(routes[,prefix][,middlewares])](#createroutesroutesprefix)
        - [Arguments (Typed)](#arguments-typed-2)
        - [Example](#example-4)
  - [License](#license)

## About

The motivation to use this package is provide a cleaner code and facilitate DRY (Don't repeat yourself) principle on tour routes.

## Features

This library support the following features:

- Declare **routes**
- Add **middleware(s)** to routes
- Add **Joi validators(@happi/joi)** to routes
- Set prefix to your routes

## Example

Here is an example to use **express-awesome-routes** in the simplest way.

### JavaScript

```js
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { createRoutes, Method } = require('../dist');

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
    function: 'getOne',
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
import { createRoutes, Method, Routes } from '../dist';

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
    function: 'getOne',
  },
];

app.use(createRoutes(routes));
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
```

## Documentation

### Routes definitions

In **Express Awesome Routes** you can build your own routes using defined objects. This objects are defined in two types: **Route** and **ProxyRoute**.

#### Route

```ts
export interface Route {
  route: string;
  method: Method;
  controller: any;
  function: string;
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

#### ValidationOptions

```ts
interface ValidatorOptions {
  type: ContainerTypes;
  schema: ObjectSchema;
  opts?: ExpressJoiContainerConfig;
}
```

#### Method

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

#### ContainerTypes

Object (enum in TS) that includes the validation types (see [express-joi-validaiton](https://www.npmjs.com/package/express-joi-validation)).

```ts
ContainerTypes.Body;
ContainerTypes.Query;
ContainerTypes.Headers;
ContainerTypes.Fields;
ContainerTypes.Params;
```

### ExpressAwesomeRoutes([options])

Class that instance a ExpressAwesomeRoutes object allowing to you pass a set of options to configure it.

##### Arguments (Typed)

```ts
ExpressAwesomeRoutes();
ExpressAwesomeRoutes(options: ExpressAwesomeRoutesOptions);
```

| ExpressAwesomeRoutesOptions | Description                                                                                                                                                                                              |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| joiPassError                | Equivalent to [passError](https://www.npmjs.com/package/express-joi-validation#createvalidatorconfig) option of [express-joi-validation](https://www.npmjs.com/package/express-joi-validation) package.  |
| joiStatusCode               | Equivalent to [statusCode](https://www.npmjs.com/package/express-joi-validation#createvalidatorconfig) option of [express-joi-validation](https://www.npmjs.com/package/express-joi-validation) package. |

##### Example

```ts
import { ExpressAwesomeRoutes } from 'express-awesome-routes';

// With default options
const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
// With options
const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes({ passError: true, statusCode: 500 });
```

#### add(routes [, prefix][, middlewares])

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
import { ExpressAwesomeRoutes, Method } from 'express-awesome-routes';
// imports...
const ear: ExpressAwesomeRoutes = new ExpressAwesomeRoutes();
const routes: Routes = [
  {
    route: 'foo',
    method: Method.Get,
    controller: ControllerClass,
    function: 'getOne',
  },
];

ear.add(routes, '/api/v1');
```

#### getRoutes()

Method that return a `Router` object (Express.js `Router`) with the routes added by `add` method.

##### Example

```ts
const router: Router = ear.getRoutes();
app.use(router);
```

### createRoutes(routes[,prefix][,middlewares])

Function that under the hood utilize [ExpressAwesomeRoutes]() class to create and get routes (`Router`) without call the above methods.

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
import { createRoutes, Method } from 'express-awesome-routes';
// imports, express instance, etc.

const routes: Routes = [
  {
    route: 'foo',
    method: Method.Get,
    controller: ControllerClass,
    function: 'getOne',
  },
];

const router: Router = createRoutes(routes);
app.use(router);
```

## License

MIT
