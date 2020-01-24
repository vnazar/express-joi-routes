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
        handler: 'getOne'
    }
]

app.use(createRoutes(routes));
app.listen(3000, () => {
    console.log('Listening on port 3000')
});