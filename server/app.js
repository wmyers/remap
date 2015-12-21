/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//use dotenv to set sensitive environment variables
//NB only for development as deploying to Azure for production
//which requires setting environment variables via app settings in web control panel
if(process.env.NODE_ENV === 'development'){
  require('dotenv').config({path: 'server/config/environment/'+ process.env.NODE_ENV +'.env'});
}

var express = require('express');
var mongoose = require('mongoose');

//generates non-secret config
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
// var socketio = require('socket.io')(server, {
//   serveClient: (config.env === 'production') ? false : true,
//   path: '/socket.io-client'
// });
// require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

//defining error handlers here so as to be able to use errorHandler middleware
//must come after all other middleware and routes definitions
var errorHandler = require('errorhandler');
var jwtError = require('./auth/jwt-error');
app.use(jwtError); // Error handler for JWT expired token
if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
  app.use(errorHandler()); // Error handler - has to be last
}

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode running node version: %s', config.port, app.get('env'), process.version);
});

// Expose app
exports = module.exports = app;
