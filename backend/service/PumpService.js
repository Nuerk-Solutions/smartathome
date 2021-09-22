'use strict';

const request = require("request");
const utils = require("../utils/utils.js");

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

          if (response.statusCode !== 200 || error) {
              return reject(utils.responseWithCode(response.statusCode, error));
          }

          const msg = {
              statusCode: response.statusCode,
              detail: response.statusMessage,
              result: body
          };
          return resolve(utils.responseWithJson(200, msg));
      });
  });
}

