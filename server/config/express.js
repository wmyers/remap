/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
// var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport = require('passport');


module.exports = function(app) {
  var env = app.get('env');

  // app.set('views', config.root + '/server/views');
  // app.set('view engine', 'jade');

  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(express.static(path.join(config.root, 'dist/public')));
    app.set('appPath', 'dist/public');
    app.use(morgan('dev'));
    //NB moved errorHandler middleware definitions to app.js, so can come after routes definitions
  }
};
