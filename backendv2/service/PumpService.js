'use strict';


/**
 * set pump state
 * By passing in the appropriate options, you can toggle the state of the Pump 
 *
 * state String Set the pump state
 * returns Pump
 **/
exports.state = function(state) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "POWER" : "ON"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

