import express, { Express, Request, Response } from 'express';
import { createRoutes, Routes, ContainerTypes, ExpressRouterHandlers } from '../src/express-awesome-routes';
import bodyParser from 'body-parser';
import Joi, { ObjectSchema } from '@hapi/joi';

const schema: ObjectSchema = Joi.object({
  message: Joi.string().required(),
  status: Joi.number().required(),
});

const app: Express = express();

class AController {
  get(_req: Request, res: Response): void {
    res.json({ message: 'A.get' });
  }
  post(_req: Request, res: Response): void {
    res.json({ message: 'A.post' });
  }
}

const route: Routes = [
  {
    routerHandler: ExpressRouterHandlers.Get,
    route: '/A',
    controller: AController,
    method: 'get',
    validators: [{ type: ContainerTypes.Body, schema: schema }],
    // middlewares: [
    //   (req: Request, _res: Response, next: NextFunction): void => {
    //     console.log(req.query);
    //     next();
    //   },
    // ],
  },
];

app.use(bodyParser.json());
app.use(createRoutes(route));
app.listen(3000, function() {
  console.log('Listening on port 3000');
});
