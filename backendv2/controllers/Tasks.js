'use strict';

var utils = require('../utils/writer.js');
var Tasks = require('../service/TasksService');

module.exports.createTask = function createTask (req, res, next, body) {
  Tasks.createTask(req, body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteTask = function deleteTask (req, res, next, id) {
  Tasks.deleteTask(req, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllTasks = function getAllTasks (req, res, next) {
  Tasks.getAllTasks(req)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getTaskById = function getTaskById (req, res, next, id) {
  Tasks.getTaskById(req, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateTask = function updateTask (req, res, next, body, id) {
  Tasks.updateTask(req, body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
