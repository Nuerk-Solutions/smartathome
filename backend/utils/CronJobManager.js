const CronJob = require('cron').CronJob;
const {
    setItemValueById,
    getItemsFromDB,
    deleteItemById,
    getItemById,
    addItemToDB, deleteDatabase
} = require('./DatabaseManager')
const axios = require('axios')
const utils = require('./utils')
let currentJobs = new Map();


const createCronTask = exports.createCronTask = function (job) {
    let cronString = getItemById("timer", job.timerId).cron

    currentJobs.set(job.id,
        new CronJob(cronString, () => {
            console.log(new Date().toTimeString(), "Timer-1");
        }, null, false, 'Europe/Berlin')
    );
    addItemToDB("jobs", job);

    //Post Job
    let postJob = {
        id: utils.uuid("3000"),
        status: utils.cronAction.START,
        timerId: job.timerId,
        cron: utils.cronOffset(cronString, getItemById("timer", job.timerId).duration)
    };

    currentJobs.set(postJob.id,
        new CronJob(postJob.cron, () => {
            console.log(new Date().toTimeString(), "Timer-2");
        }, null, true, 'Europe/Berlin')
    );
    addItemToDB("jobs", postJob);

}


function createJob(timer, shouldStart) {
    axios.post('http://localhost:9001/api/v1/jobs', {
        timerId: timer.id,
        cron: timer.cron
    }).then(res => {
        if (shouldStart)
            runActionOnCronTask(res.data.detail.id, utils.cronAction.START);
    }).catch(error => {
        console.error(error)
    })
}

exports.initCronFromConfig = function () {
    getItemsFromDB("timer").forEach(timer => {
        createJob(timer, true);
    })
}

exports.shutdownCron = function () {
    deleteDatabase("jobs");

}

const getCronTask = exports.getCronTask = function (jobId) {
    return currentJobs.get(jobId);
}


const runActionOnCronTask = exports.runActionOnCronTask = function (jobId, action) {
    switch (action) {
        case utils.cronAction.START:
            getCronTask(jobId).start();
            break;
        case utils.cronAction.STOP:
            getCronTask(jobId).stop();
            break;
    }
    setItemValueById("jobs", jobId, 'status', action);
    return true;
}
