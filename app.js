'use strict';

const fs = require('fs');
const debug = require('debug')('MsGraph:app');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRouter = require('./routes/auth-router');
const resourceRouter = require('./routes/resource-router');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRouter);
app.use(resourceRouter);

// rendering route
// app.post('/', function (req, res) {
//   console.log(req.body);
//   res.send(html);
// });

/// error handler
app.use(function (err, req, res, next) {
  debug('error');
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {
      status: err.status,
      details: err.stack
    }
  });
});

module.exports = app;
