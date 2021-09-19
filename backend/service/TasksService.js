'use strict';

var utils = require('../utils/reponseUtils.js');

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}

/**
 * Create Task
 *
 * body Timer Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.createTask = function (req, body) {
    return new Promise(function (resolve, reject) {
        let task = {
            id: uuid(),
            ...body
        };

        try {
            req.app.db.get("tasks").push(task).write();
            return resolve(utils.responseCreated(task));
        } catch (error) {
            return reject(utils.responseWithCode(500, error));
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

        //find the task
        let todo = req.app.db.get("tasks").find({
            id: id
        }).value()

        if (todo === undefined) {
            return reject(utils.responseWithCode(404, "Invalid Id", id));
        }

        // delete the task.
        try {
            req.app.db.get("tasks").remove({
                id: id
            }).write();
            return resolve(utils.responseDeleted(id));
        } catch (error) {
            return reject(utils.responseWithCode(500, error));
        }

    });
}


/**
 * Get All Tasks
 *
 * returns Tasks
 **/
exports.getAllTasks = function (req) {
    return new Promise(function (resolve, reject) {
        let tasks = req.app.db.get('tasks').value();
        const msg = {
            statusCode: 200,
            length: tasks.length,
            tasks: tasks
        };
        return resolve(utils.responseWithJson(200, msg));
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

        let todo = req.app.db.get('tasks').find({
            id: id
        }).value();

        if (todo === undefined) {
            return reject(utils.responseWithCode(404, "Invalid Id", id));
        }

        const msg = {
            statusCode: 200,
            todo: todo
        };
        return resolve(utils.responseWithJson(200, msg));
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
        //find task.
        let todo = req.app.db.get("tasks").find({
            id: id
        }).value();

        if (todo === undefined) {
            return reject(utils.responseWithCode(404, "Invalid Id", id));
        }

        //update that task.
        try {
            req.app.db.get("tasks").find({
                id: id
            })
                .assign(body)
                .write();
            const msg = {
                statusCode: 200,
                todo: todo
            };
            return resolve(utils.responseWithJson(200, msg));
        } catch (error) {
            return reject(utils.responseWithCode(500, error));
        }
    });
}

