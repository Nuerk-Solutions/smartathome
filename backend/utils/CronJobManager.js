const CronJob = require('cron').CronJob;
const {setItemValueById, getItemsFromDB, deleteItemById, getItemById, addItemToDB, deleteDatabase} = require('./DatabaseManager')
const axios = require('axios')
const utils = require('./utils')
let currentJobs = new Map();

const cronAction = exports.cronAction = {
    START: "running",
    STOP: "stopped",
    WAITING: "waiting"
}

const createCronTask = exports.createCronTask = function (job) {
    let cronString = getItemById("timer", job.timerId).cron
    let cronOffSetString = utils.cronOffset(cronString, getItemById("timer", job.timerId).duration);

    const cronJob = new CronJob(cronString, function () {
        console.log(new Date().toTimeString(), "Timer-1");
    }, null, false, 'Europe/Berlin');
    currentJobs.set(job.id, cronJob);

    const cronJobPost = new CronJob(cronOffSetString, function () {
        console.log(new Date().toTimeString(), "Timer-2");
    }, null, true, 'Europe/Berlin');
    currentJobs.set(utils.uuid(1), cronJobPost);
    addItemToDB("jobs", job);
    return cronJob;
}

exports.initCronFromConfig = function () {
    getItemsFromDB("timer").forEach(timer => {
        axios.post('http://localhost:9001/api/v1/jobs', {
            timerId: timer.id
            // dateTimeStart: new Date().toLocaleTimeString(),
            // dateTimeEnd: new Date(new Date().getTime() + timer.duration * 1000).toLocaleTimeString()
        }).then(res => {
            runActionOnCronTask(res.data.detail.id, cronAction.START);
        })
            .catch(error => {
                console.error(error)
            })
    })
}

exports.shutdownCron = function () {
    getItemsFromDB("jobs").forEach(job => {
        deleteItemById("jobs", job.id);
        runActionOnCronTask(job.id, cronAction.STOP)
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
