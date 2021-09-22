'use strict';

var utils = require('../utils/reponseUtils.js');

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}

/**
 * Create a new Job
 *
 * body Job
 * returns Job
 **/
exports.createJob = function (req, body) {
    return new Promise(function (resolve, reject) {
        let job = {
            id: uuid(),
            ...body
        };

        try {
            req.app.db.get("jobs").push(job).write();
            return resolve(utils.responseCreated(job));
        } catch (error) {
            return reject(utils.responseWithCode(500, error));
        }
    });
}


/**
 * Delete a job by an id
 *
 * id Id Deleting a done job
 * no response value expected for this operation
 **/
exports.deleteJob = function (req, id) {
    return new Promise(function (resolve, reject) {

        //find the job
        let job = req.app.db.get("jobs").find({
            id: id
        }).value()

        if (job === undefined) {
            return reject(utils.responseWithCode(404, "Invalid Id", id));
        }

        // delete the job.
        try {
            req.app.db.get("jobs").remove({
                id: id
            }).write();
            return resolve(utils.responseDeleted(id));
        } catch (error) {
            return reject(utils.responseWithCode(500, error));
        }

    });
}


/**
 * Retrieves all Jobs
 *
 * returns Jobs
 **/
exports.getAllJobs = function (req) {
    return new Promise(function (resolve, reject) {
        let jobs = req.app.db.get('jobs').value();
        const msg = {
            statusCode: 200,
            length: jobs.length,
            jobs: jobs
        };
        return resolve(utils.responseWithJson(200, msg));
    });
}


/**
 * Get a Job by an id
 *
 * id Id A single job id
 * returns Job
 **/
exports.getJobById = function (req, id) {
    return new Promise(function (resolve, reject) {

        let job = req.app.db.get('jobs').find({
            id: id
        }).value();

        if (job === undefined) {
            return reject(utils.responseWithCode(404, "Invalid Id", id));
        }

        const msg = {
            statusCode: 200,
            job: job
        };
        return resolve(utils.responseWithJson(200, msg));
    });
}


/**
 * Update the status of a Job by an id
 *
 * body String
 * id Id Represents the Id of Job to be updated
 * returns List
 **/
exports.patchJob = function (req, body, id) {
    return new Promise(function (resolve, reject) {
        //find job.
        let job = req.app.db.get("jobs").find({
            id: id
        }).value();

        if (job === undefined) {
            return reject(utils.responseWithCode(404, "Invalid Id", id));
        }

        console.log(body.status)

        //patch that job.
        try {
            req.app.db.get("jobs").find({
                id: id
            })
                .set('status', body.status)
                .write();
            const msg = {
                statusCode: 200,
                todo: job
            };
            return resolve(utils.responseWithJson(200, msg));
        } catch (error) {
            return reject(utils.responseWithCode(500, error));
        }
    });
}


/**
 * Update a Job by an id
 *
 * body Job
 * id Id Represents the Id of Job to be updated
 * returns Job
 **/
exports.updateJob = function (req, body, id) {
    return new Promise(function (resolve, reject) {
        //find job.
        let job = req.app.db.get("jobs").find({
            id: id
        }).value();

        if (job === undefined) {
            return reject(utils.responseWithCode(404, "Invalid Id", id));
        }

        //update that job.
        try {
            req.app.db.get("jobs").find({
                id: id
            })
                .assign(body)
                .write();
            const msg = {
                statusCode: 200,
                todo: job
            };
            return resolve(utils.responseWithJson(200, msg));
        } catch (error) {
            return reject(utils.responseWithCode(500, error));
        }
    });
}

