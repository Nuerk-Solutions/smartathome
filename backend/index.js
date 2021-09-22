

//General requirements
const path = require('path');
const http = require('http');
const oas3Tools = require('oas3-tools');
const {join} = require('path');

// DB requirements
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

// DB init & default handling
const adapter = new FileSync(join(__dirname, 'db.json'));
const db = low(adapter);
db.defaults({jobs: [], timer: []}).write();


// swaggerRouter configuration
const serverPort = 9001;
const options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
const app = expressAppConfig.getApp();

app.db = db;

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log("Server Ready!");
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});
