'use strict';

var utils = require('../utils/writer.js');
var Jobs = require('../service/JobsService');

module.exports.createJob = function createJob (req, res, next, body) {
  Jobs.createJob(req, body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteJob = function deleteJob (req, res, next, id) {
  Jobs.deleteJob(req, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllJobs = function getAllJobs (req, res, next) {
  Jobs.getAllJobs(req)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getJobById = function getJobById (req, res, next, id) {
  Jobs.getJobById(req, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchJob = function patchJob (req, res, next, body, id) {
  Jobs.patchJob(req, body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateJob = function updateJob (req, res, next, body, id) {
  Jobs.updateJob(req, body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
