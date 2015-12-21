'use strict';

exports.requestCollectionFactory = function(){
  var request_collection = {
    creation_timestamp:Date.now(),
    fufilled_timestamp:null,
    priority:'FIRST_TIME',
    status:'PENDING',
    requests: []
  }
  return request_collection;
};

exports.requestObjectFactory = function(){
  var request_object = {
    id:null,
    creation_timestamp:Date.now(),
    request_timestamp:null,
    response_timestamp:null,
    status:'PENDING'
  }
  return request_object;
}
