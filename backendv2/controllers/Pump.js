'use strict';

var utils = require('../utils/writer.js');
var Pump = require('../service/PumpService');

module.exports.state = function state (req, res, next, state) {
  Pump.state(state)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
