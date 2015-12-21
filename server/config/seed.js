/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var UserLimit = require('../api/user/userLimit.model');

UserLimit.find({}).remove(function() {
  console.log('removed userlimits');
});

User.find({}).remove(function() {
  console.log('removed users');
  createTestUsers();
});

function createTestUsers (){
  //test employee
  User.create({
    provider: 'local',
    firstName: 'Dave',
    lastName: 'Test',
    email: 'dave@test.com',
    password: 'test',
    role: 'admin'
  }, function(err, user) {
      console.log('created test user');
    }
  );
}
