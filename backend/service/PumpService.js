'use strict';


const request = require("request");
/**
 * set pump state
 * By passing in the appropriate options, you can toggle the state of the Pump
 *
 * state String Set the pump state
 * returns Pump
 **/
exports.state = function(state) {
  return new Promise(function(resolve, reject) {
      request({url: 'http://nuerk.dynv6.net/cm?user=admin&password=Tasmota2021!&cmnd=Power%20' + state, timeout: 3500}, function (error, response, body) {
          const msg = {
              ErrorCode: response.statusCode,
              Message: response.statusMessage,
              Detail: body
          };
          if (response.statusCode !== 200 || error) {
              return reject(JSON.stringify(msg));
          }
          resolve(body);
      });
  });
}

