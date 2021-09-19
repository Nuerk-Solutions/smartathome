'use strict';

var utils = require('../utils/reponseUtils.js');

const {nanoid} = require("nanoid");
const idLength = 8;

/**
 * Create Task
 *
 * body Timer Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.createTask = function (req, body) {
    return new Promise(function (resolve, reject) {
        let task = {
            id: nanoid(idLength),
            ...body
        };

        try {
            req.app.db.get("tasks").push(task).write();
            return resolve(utils.responseCreated(task));
        } catch (error) {
            return reject(utils.responseError(error.code, error));
        }
    });
}


/**
 * Deleting a task
 *
 * id Id Deleting a done task
 * no response value expected for this operation
 **/
exports.deleteTask = function (req, id) {
    return new Promise(function (resolve, reject) {
        resolve();
    });
}


/**
 * Get All Tasks
 *
 * returns Tasks
 **/
exports.getAllTasks = function (req) {
    return new Promise(function (resolve, reject) {
        return resolve();
    });
}


/**
 * Get a Task by id
 *
 * id Id A single task id
 * returns Timer
 **/
exports.getTaskById = function (req, id) {
    return new Promise(function (resolve, reject) {
        return resolve();
    });
}


/**
 * Update a Task
 *
 * body Timer Updated a Timer object
 * id Id Id of task to be updated
 * returns Timer
 **/
exports.updateTask = function (req, body, id) {
    return new Promise(function (resolve, reject) {
        return resolve();
    });
}

