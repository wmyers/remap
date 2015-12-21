'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost:27017/sloc-dev'
    // uri: process.env.MONGOLAB_URI
  },

  port: 8080,

  seedDB: true
};
