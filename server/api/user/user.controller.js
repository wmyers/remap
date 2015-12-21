'use strict';

var User = require('./user.model');
var UserLimit = require('../user/userLimit.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
  * Middleware that binds usage to a monetization model of credits, which falls
  * back to a free tier with an enforced time-limit interval between each free request
  *
  * Check if a user is on the free tier and has used up their free request quota
  * i.e. they have no credits and last made a free request less than LIMIT time ago (see userLimit.model.js)
  * NB when a user runs out of credits they automatically move onto the free request tier
  */
exports.authUserLimit = function(req, res, next){
  //returned from auth.isAuthenticated() middleware
  var user = req.user;

  //check if user is on free tier
  var isFreeTier = user.credits === 0;
  if(isFreeTier){
    UserLimit.findOne({ 'userId': user._id }, function(err, userLimit){
      if (err) return next(err);

      //if user exists return a limit message
      //NB if the limit has expired then the userId will not be found in UserLimit
      if(userLimit){
         return next({message: "You can try again "+userLimit.nextRequestTime});
      }else{
        //if the user does not exist then add a new UserLimit instance starting from now and continue
        //currently wait for 1 minute
        var newUserLimit =  new UserLimit({
            expireAt: new Date(Date.now() + 1 * 60 * 1000),
            userId:user._id
        });
        newUserLimit.save(function(err, result) {
            if (err) return next(err);
            next();
        })
      }
    })
  }
}

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new local-type user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, process.env.SESSION_SECRET, { expiresInMinutes: 60*5 });
    res.json({ token: token });
    //-----
    //store userId on request for next middleware
    req.userId = user._id;
    next();
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json({ user:user.profile });
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a local-type users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);

    var body = { user:user.profile };
    res.json(body);
  })
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

exports.createUserToken = function(user){
  var token = jwt.sign({_id: user._id }, process.env.SESSION_SECRET, { expiresInMinutes: 60*5 });
  return token;
}
