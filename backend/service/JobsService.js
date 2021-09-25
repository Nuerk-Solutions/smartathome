'use strict';

const utils = require('../utils/utils.js');
const responseUtils = require('../utils/responseUtils.js');
const CronJobManager = require('../utils/CronJobManager');
const DatabaseManager = require('../utils/DatabaseManager');



/**
 * Create a new Job
 *
 * body Job
 * returns Job
 **/
exports.createJob = function (req, body) {
    return new Promise(function (resolve, reject) {
        let job = {
            id: utils.uuid("0"),
            status: "waiting",
            ...body
        };

        // const cronJob = new CronJob('* * * * * *', function () {
        //     console.log('You will see this message every second');
        // }, null, false, 'Europe/Berlin');
        // currentJobs.set(job.id, cronJob);
        //
        // console.log(currentJobs);

        try {
            DatabaseManager.addItemToDB(req, "jobs", job);
            // req.app.db.get("jobs").push(job).write();
            return resolve(responseUtils.responseCreated(job));
        } catch (error) {
            return reject(responseUtils.responseWithCode(500, error));
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
        let job = DatabaseManager.deleteItemById(req, "jobs", id);

        if (job === undefined) {
            return reject(responseUtils.responseWithCode(404, "Invalid Id", id));
        }

        // delete the job.
        try {
            DatabaseManager.deleteItemById(req, "jobs", id);
            return resolve(responseUtils.responseDeleted(id));
        } catch (error) {
            return reject(responseUtils.responseWithCode(500, error));
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
        let jobs = DatabaseManager.getItemsFromDB(req, "jobs");
        const msg = {
            statusCode: 200,
            length: jobs.length,
            jobs: jobs
        };
        return resolve(responseUtils.responseWithJson(200, msg));
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

        let job = DatabaseManager.getItemById(req, "jobs", id);

        if (job === undefined) {
            return reject(responseUtils.responseWithCode(404, "Invalid Id", id));
        }

        const msg = {
            statusCode: 200,
            job: job
        };
        return resolve(responseUtils.responseWithJson(200, msg));
    });
}

/**
 * Start, stop or pause a job
 *
 * id Id A single job id
 * action JobAction Action type
 * returns Job
 **/
exports.jobActionById = function (req, id, action) {
    return new Promise(function (resolve, reject) {

        let status = 'waiting'

        CronJobManager.runActionOnCronTask(id, action)
        switch (action) {
            case "start":
                status = "started"
                break;
            case "stop":
                status = "stopped";
                break;
            case "abort":
                status = "aborted";
                break
        }

        req.app.db.get("jobs").find({
            id: id
        })
            .set('status', status)
            .write();
        const msg = {
            statusCode: 200,
            status: status
        };
        resolve(responseUtils.responseWithJson(200, msg));
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
        let job = DatabaseManager.getItemById(req, "jobs", id);

        if (job === undefined) {
            return reject(responseUtils.responseWithCode(404, "Invalid Id", id));
        }

        //update that job.
        try {
            DatabaseManager.updateItemById(req, "jobs", id, body);
            const msg = {
                statusCode: 200,
                job: job
            };
            return resolve(responseUtils.responseWithJson(200, msg));
        } catch (error) {
            return reject(responseUtils.responseWithCode(500, error));
        }
    });
}

