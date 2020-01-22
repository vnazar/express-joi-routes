# Express Awesome Routes

Package for express.js framework that allow to you santadarize your routes with the flexibility as you want.

## Table of Content
* [About](#about)
* [Features](#features)
* [Example](#example)
    * [JavaScript](#javascript)
    * [TypesScript](#typescript)
* [Documentation](#documentation)
* [License](#documentation)

## About
The motivation to use this package is provide a cleaner code and facilitate DRY (Don't repeat yourself) principle on tour routes.

## Features
This library support the following features:
* Declare **routes**
* Add **middleware(s)** to routes
* Add **Joi validators(@happi/joi)** to routes 
* Set prefix to your routes

## Example
Here is an example to use **express-awesome-routes** in the simplest way.

### JavaScript
```js
'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const { createRoutes, Method } = require('../dist');

class Controller {
    getOne(_req, res) {
        res.json({
            message: 'ok'
        })
    }
}

const app = express();
app.use(bodyParser.json());

const routes = [{
        route: '/foo',
        method: Method.Get,
        controller: Controller,
        function: 'getOne'
    }
]

app.use(createRoutes(routes));
app.listen(3000, () => {
    console.log('Listening on port 3000')
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
The package includes the following methods.

### Structure
* [ExpressAwesomeRoutes([options])](#expressawesomeroutesoptions)
  * [add(routes[,prefix][,middlewares])](#addroutes--prefix-middlewares)
  * [getRoutes()](#getroutes)
* [createRoutes(routes[,prefix][,middlewares])](#createroutesroutesprefixmiddlewares)

### ExpressAwesomeRoutes([options])
Class that instance a ExpressAwesomeRoutes object allowing to you pass a set of options to configure it.

##### Arguments (Typed)
```ts
ExpressAwesomeRoutes();
ExpressAwesomeRoutes(options: ExpressAwesomeRoutesOptions);
```

| ExpressAwesomeRoutesOptions | Description                                                                                                                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| joiPassError                | Equivalent to [passError](https://www.npmjs.com/package/express-joi-validation#createvalidatorconfig) option of [express-joi-validation](https://www.npmjs.com/package/express-joi-validation) package.    |
| joiStatusCode               | Equivalent to [statusCode](https://www.npmjs.com/package/express-joi-validation#createvalidatorconfig) option of [express-joi-validation]( https://www.npmjs.com/package/express-joi-validation ) package. |

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
        function: 'getOne'
    }
]

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
import {createRoutes, Method} from 'express-awesome-routes';
// imports, express instance, etc.

const routes: Routes = [
    {
        route: 'foo',
        method: Method.Get,
        controller: ControllerClass,
        function: 'getOne'
    }
]

const router: Router = createRoutes(routes);
app.use(router);
```

## License
MIT