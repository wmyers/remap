var bluebird = require('bluebird');
var request = require('request');

module.exports.getIPGeoLocationAsPromise = function(ip){

  //TODO temp using freegeoip.net/{format}/{IP_or_hostname} as maxmind credentials not working
  //freegeoip returns JSON:
  /*
  {
    "ip": "49.128.60.144",
    "country_code": "SG",
    "country_name": "Singapore",
    "region_code": "",
    "region_name": "",
    "city": "Singapore",
    "zip_code": "",
    "time_zone": "Asia/Singapore",
    "latitude": 1.2931,
    "longitude": 103.8558,
    "metro_code": 0
  }
  */

  var geoIPSrvcURL = "http://freegeoip.net/json/"+ip;
  return new bluebird( function(resolve, reject) {
    request(
      geoIPSrvcURL,
      function(err, response, body) {
        if(err){
          return reject(err);
        }
        var geoData;
        try{
          geoData = JSON.parse(body);
        }
        catch(error){
          return reject(geoData+". Unable to parse geoData to JSON");
        }
        return resolve(
          //return this JSON format
          {
            createdAt: Date.now(),
            address: ip,
            geo:[geoData.latitude, geoData.longitude]
          }
        );
      }
    );
  })
}
