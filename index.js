'use strict';

const express = require('express');
const {createRoutes, ContainerTypes} = require('./dist/express-awesome-routes');

const bodyParser = require('body-parser') 
const app = express();

class AController {
  get(_req , res) {
    res.json({ message: 'A.get' });
  }
  post(_req, res) {
    res.json({ message: 'A.post' });
  }
}

const route = [
  {
    routerHandler: 'get',
    route: '/A',
    controller: AController,
    function: 'get',
    // middlewares: [
    //   (req: Request, _res: Response, next: NextFunction): void => {
    //     console.log(req.query);
    //     next();
    //   },
    // ],
  }
]

console.log(ContainerTypes.Body)
app.use(bodyParser.json())
app.use(createRoutes(route))
app.listen(3000, function() {
  console.log('Listening on port 3000');
});
