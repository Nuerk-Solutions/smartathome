//General requirements
const path = require('path');
const http = require('http');
const oas3Tools = require('oas3-tools');
const {join} = require('path');
const CronJobManager = require('./utils/CronJobManager');
const DatabaseManager = require('./utils/DatabaseManager')


// swaggerRouter configuration
const serverPort = 9001;
const options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
const app = expressAppConfig.getApp();


app.db = DatabaseManager.initDatabase();
CronJobManager.initAllCronTasks();

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log("Server Ready!");
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});


process.stdin.resume();

function exitHandler(options, exitCode) {
    if (options.cleanup) {
        CronJobManager.finalizeAllCronTasks();
        console.log('Disposed all Jobs!');
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, {cleanup: true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit: true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit: true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit: true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit: true}));
