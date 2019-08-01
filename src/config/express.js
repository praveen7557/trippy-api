const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { logs } = require('./vars');
const routes = require('../api/routes/v1');

const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', routes);

module.exports = app;