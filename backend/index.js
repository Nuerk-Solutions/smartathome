//General requirements
const path = require('path');
const http = require('http');
const oas3Tools = require('oas3-tools');
const {join} = require('path');
const CronJobManager = require('./utils/CronJobManager');
const DatabaseManager = require('./utils/DatabaseManager')
const utils = require('./utils/utils')


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
DatabaseManager.deleteDatabase("jobs");
CronJobManager.initCronFromConfig();



// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log("Server Ready!");
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});


process.stdin.resume();

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, function () {
        CronJobManager.shutdownCron();
        console.log('Disposed all Jobs!');
    });
})
