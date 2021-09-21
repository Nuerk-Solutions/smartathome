//General requirements
const path = require('path');
const spdy = require("spdy")
const oas3Tools = require('oas3-tools');
const {join} = require('path');
const fs = require("fs")

// DB requirements
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

// DB init & default handling
const adapter = new FileSync(join(__dirname, 'db.json'));
const db = low(adapter);
db.defaults({tasks: []}).write();


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
spdy.createServer({
        key: fs.readFileSync("./server.key"),
        cert: fs.readFileSync("./server.crt")
    },
    app
).listen(serverPort, (error) => {
    if (error)
        throw error;
    console.log("Server Ready!");
    console.log('Your server is listening on port %d (https://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on https://localhost:%d/docs', serverPort);
});
