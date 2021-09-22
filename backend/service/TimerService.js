'use strict';

const utils = require('../utils/utils.js');


/**
 * Create a new Timer
 *
 * body Timer
 * returns Timer
 **/
exports.createTimer = function (req, body) {
    return new Promise(function (resolve, reject) {
        let timer = {
            id: utils.uuid("1"),
            ...body
        };

        try {
            req.app.db.get("timer").push(timer).write();
            return resolve(utils.responseCreated(timer));
        } catch (error) {
            return reject(utils.responseWithCode(500, error));
        }
    });
}


/**
 * Delete a Timer by an id
 *
 * id Id Deleting a Timer done
 * no response value expected for this operation
 **/
exports.deleteTimer = function (req, id) {
    return new Promise(function (resolve, reject) {

        //find the task
        let timer = req.app.db.get("timer").find({
            id: id
        }).value()

        if (timer === undefined) {
            return reject(utils.responseWithCode(404, "Invalid Id", id));
        }

        // delete the task.
        try {
            req.app.db.get("timer").remove({
                id: id
            }).write();
            return resolve(utils.responseDeleted(id));
        } catch (error) {
            return reject(utils.responseWithCode(500, error));
        }

    });
}


/**
 * Retrieves all Timer
 *
 * returns Timers
 **/
exports.getAllTimer = function (req) {
    return new Promise(function (resolve, reject) {
        let timer = req.app.db.get('timer').value();
        const msg = {
            statusCode: 200,
            length: timer.length,
            timer: timer
        };
        return resolve(utils.responseWithJson(200, msg));
    });
}


/**
 * Get a Timer by an id
 *
 * id Id A single Timer id
 * returns Timer
 **/
exports.getTimerById = function (req, id) {
    return new Promise(function (resolve, reject) {

        let timer = req.app.db.get('timer').find({
            id: id
        }).value();

        if (timer === undefined) {
            return reject(utils.responseWithCode(404, "Invalid Id", id));
        }

        const msg = {
            statusCode: 200,
            timer: timer
        };
        return resolve(utils.responseWithJson(200, msg));
    });
}


/**
 * Update a Timer by an id
 *
 * body Timer
 * id Id Represents the Id of Timer to be updated
 * returns Timer
 **/
exports.updateTimer = function (req, body, id) {
    return new Promise(function (resolve, reject) {
        //find task.
        let timer = req.app.db.get("timer").find({
            id: id
        }).value();

        if (timer === undefined) {
            return reject(utils.responseWithCode(404, "Invalid Id", id));
        }

        //update that task.
        try {
            req.app.db.get("timer").find({
                id: id
            })
                .assign(body)
                .write();
            const msg = {
                statusCode: 200,
                timer: timer
            };
            return resolve(utils.responseWithJson(200, msg));
        } catch (error) {
            return reject(utils.responseWithCode(500, error));
        }
    });
}

