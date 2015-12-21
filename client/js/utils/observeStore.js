'use strict';

var Promise = require('bluebird');

function observeStore(store, predicate) {
  var performCheck;

  return new Promise(resolve => {
    performCheck = () => {
      if (predicate.call(null, store)) {
        resolve();
      }
    };

    store.addChangeListener(performCheck);
    performCheck();

  }).finally(() => {
    store.removeChangeListener(performCheck);
  });
}

module.exports = observeStore;
