'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

//based on
//http://stackoverflow.com/questions/24596796/mongoose-expire-data-but-keep-in-database
//http://ibmmobiletipsntricks.com/2014/09/10/custom-expiry-times-for-mongoose-documents-in-node-js/

//see my path of discovery about ttl indexes: http://stackoverflow.com/a/33934421/4097475

var UserLimitSchema = new Schema({
    expireAt: Date,
    userId: { type: Schema.Types.ObjectId }
});

UserLimitSchema
  .virtual('nextRequestTime')
  .get(function() {
    //allow for reaper running at 60 second intervals to cause expireAt.fromNow message to be 'in the past'
    var nextRequestTime = moment(this.expireAt).fromNow();
    if(String(nextRequestTime).indexOf("ago") > -1){
      nextRequestTime = "in a few seconds";
    }
    return nextRequestTime;
  });

var userLimitModel =  mongoose.model('UserLimit', UserLimitSchema);

//this should ensure that the expireAt field is ttl indexed:
//http://stackoverflow.com/questions/19106684/whats-the-benefit-of-mongodbs-ttl-collection-vs-purging-data-from-a-housekeep
//https://docs.mongodb.org/manual/tutorial/expire-data/
//https://docs.mongodb.org/manual/core/index-ttl/
//http://stackoverflow.com/questions/10519432/how-to-do-raw-mongodb-operations-in-mongoose
userLimitModel.collection.ensureIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } );



module.exports = userLimitModel;
