const CronJob = require('cron').CronJob;
const {getDatabase, setItemValueById, getItemsFromDB, deleteItemById, deleteDatabase} = require('./DatabaseManager')
let currentJobs = new Map();

const cronAction = exports.cronAction = {
    START: "running",
    STOP: "stopped"
}

const createCronTask = exports.createCronTask = function (jobId, cronString) {
    const cronJob = new CronJob(cronString, function () {
        console.log('You will see this message every second for: ' + jobId);
    }, null, false, 'Europe/Berlin');
    currentJobs.set(jobId, cronJob);
    return cronJob;
}

exports.initAllCronTasks = function () {
    getItemsFromDB("jobs").forEach(job => {
        let timer = getDatabase().get("timer").find({
            id: job.timerId
        }).value();
        createCronTask(job.id, timer.cron);
        runActionOnCronTask(job.id, cronAction.START)
    })
}

exports.finalizeAllCronTasks = function () {
    getItemsFromDB("jobs").forEach(job => {
        runActionOnCronTask(job.id, cronAction.STOP)
        // deleteDatabase("jobs");
    })
}

const getCronTask = exports.getCronTask = function (jobId) {
    return currentJobs.get(jobId);
}


const runActionOnCronTask = exports.runActionOnCronTask = function (jobId, action) {
    switch (action) {
        case cronAction.START:
            getCronTask(jobId).start();
            break;
        case cronAction.STOP:
            getCronTask(jobId).stop();
            break;
    }
    setItemValueById("jobs", jobId, 'status', action);
    return true;
}
