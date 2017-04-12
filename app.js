'use strict';

var debug = require('debug')('MsGraph:app');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

var authRouter = require('./routes/auth-router');
var resourceRouter = require('./routes/resource-router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRouter);
app.use(resourceRouter);

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
