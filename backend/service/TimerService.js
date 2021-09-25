'use strict';

const responseUtils = require('../utils/responseUtils.js');
const utils = require('../utils/utils.js');
const DatabaseManager = require('../utils/DatabaseManager');


/**
 * Create a new Timer
 *
 * body Timer
 * returns Timer
 **/
exports.createTimer = function (req, body) {
    return new Promise(function (resolve, reject) {
        let timer = {
            id: utils.uuid("1000"),
            timestamp: new Date().toLocaleTimeString(),
            ...body,
        };

        try {
            // req.app.db.get("timer").push(timer).write();
            DatabaseManager.addItemToDB("timer", timer);
            return resolve(responseUtils.responseCreated(timer));
        } catch (error) {
            return reject(responseUtils.responseWithCode(500, error));
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
        let timer = DatabaseManager.getItemById("timer", id);

        if (timer === undefined) {
            return reject(responseUtils.responseWithCode(404, "Invalid Id", id));
        }

        // delete the task.
        try {
            DatabaseManager.deleteItemById("timer", id);
            return resolve(responseUtils.responseDeleted(id));
        } catch (error) {
            return reject(responseUtils.responseWithCode(500, error));
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
        let timer = DatabaseManager.getItemsFromDB("timer");
        const msg = {
            statusCode: 200,
            length: timer.length,
            timer: timer
        };
        return resolve(responseUtils.responseWithJson(200, msg));
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

        let timer = DatabaseManager.getItemById("timer", id);

        if (timer === undefined) {
            return reject(responseUtils.responseWithCode(404, "Invalid Id", id));
        }

        const msg = {
            statusCode: 200,
            timer: timer
        };
        return resolve(responseUtils.responseWithJson(200, msg));
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
        let timer = DatabaseManager.getItemById("timer", id);

        if (timer === undefined) {
            return reject(responseUtils.responseWithCode(404, "Invalid Id", id));
        }

        //update that task.
        try {
            DatabaseManager.updateItemById("timer", id, body);
            const msg = {
                statusCode: 200,
                timer: timer
            };
            return resolve(responseUtils.responseWithJson(200, msg));
        } catch (error) {
            return reject(responseUtils.responseWithCode(500, error));
        }
    });
}

