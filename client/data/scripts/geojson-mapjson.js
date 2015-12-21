var jsonfile = require('jsonfile');
var _ = require('lodash');
var moment = require('moment');

//NB run this script from the project root
var fileIn = './client/data/scripts/in/geojson-sample.json';
var fileOut = './client/data/scripts/out/demo.json';

//use Singapore as centre point with 30 degrees radius
var centre = [1.3,103.8];
var radius  = 30

//generates a demo target location history using scraped geojson data
//applies generated timestamp and dummy ip address props for each loc object

jsonfile.readFile(fileIn, function(err, obj) {
  if(err){
    console.error(err);
    return;
  }

  var locs = [], locationsObj = {};

  //scrape the list of geometry coords
  var locations = _.uniq(_.pluck(obj.features, 'geometry'));

  //filter to be APAC region around Singapore
  locations = _.filter(locations, function(l){
    var coords = l.coordinates;
    return Math.abs(centre[0]-coords[1]) <= radius && Math.abs(centre[1]-coords[0]) <= radius;
  })

  //add dummy props
  locations.forEach(function(l, i){
    locs.push({
      geo:[l.coordinates[1], l.coordinates[0]],
      address:'192.168.0.1',
      createdAt:moment().subtract(i, 'days')
    });
  });

  locationsObj.locations = locs;
  //write out
  jsonfile.writeFile(fileOut, locationsObj, function (err) {
    if(err){
      return console.error(err);
    }
    console.log('Done!');
  })
})
