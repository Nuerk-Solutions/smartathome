'use strict';

var utils = require('../utils/writer.js');
var Timer = require('../service/TimerService');

module.exports.createTimer = function createTimer (req, res, next, body) {
  Timer.createTimer(req, body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteTimer = function deleteTimer (req, res, next, id) {
  Timer.deleteTimer(req, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllTimer = function getAllTimer (req, res, next) {
  Timer.getAllTimer(req)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getTimerById = function getTimerById (req, res, next, id) {
  Timer.getTimerById(req, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateTimer = function updateTimer (req, res, next, body, id) {
  Timer.updateTimer(req, body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
