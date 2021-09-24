const CronJob = require('cron').CronJob;
let currentJobs = new Map();

const createCronTask = exports.createCronTask = function (jobId, cronString) {
    const cronJob = new CronJob(cronString, function () {
        console.log('You will see this message every second for: ' + jobId);
    }, null, false, 'Europe/Berlin');
    currentJobs.set(jobId, cronJob);
    return cronJob;
}

exports.initAllCronTasks = function (db) {
    let jobs = db.get('jobs').value();
    jobs.forEach(job => {
        let timer = db.get("timer").find({
            id: job.timerId
        }).value();
        createCronTask(job.id, timer.cron).start()
    })
}

const getCronTask = exports.getCronTask = function (jobId) {
    return currentJobs.get(jobId);
}


exports.runActionOnCronTask = function (jobId, action) {
    switch (action) {
        case "start":
            getCronTask(jobId).start();
            break;
        case "stop": case "abort":
            getCronTask(jobId).stop();
            break;
    }
    return true;
}
