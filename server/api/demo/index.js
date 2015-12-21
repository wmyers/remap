'use strict';

var express = require('express');
var auth = require('../../auth/auth.service');
var geoService = require('../../components/geo');

var router = express.Router();

router.get('/geoip/:ip',
    auth.isAuthenticated(),
    function(req, res, next){
      geoService.getIPGeoLocationAsPromise(req.params.ip)
      .then(function(locationData){
        return res.json({locations:[locationData]});
      })
      .catch(function(error){
        return next(error);
      });
    }
  );

module.exports = router;
