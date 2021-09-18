
var http = require('http');
var express = require('express');
var app = express();

var cors = require('cors');
var bodyParser = require('body-parser');
var swaggerTools = require('oas-tools');

// Local DB requirements
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const {join} = require('path');

// Local DB inits
const adapter = new FileSync(join(__dirname,'..','db.json'));
const db = low(adapter);
db.defaults({ tasks:[] }).write();

const jsyaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
var serverPort = 8080;

app.db = db;

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync('./api/openapi.yaml', 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);
//
var options_object = {
    controllers: path.join(__dirname, './controllers'),
    checkControllers: true,
    loglevel: 'info',
    logfile: '/logger/log.info',
    strict: true,
    router: true,
    validator: true,
    docs: {
        apiDocs: '/api-docs',
        apiDocsPrefix: '',
        swaggerUi: '/docs',
        swaggerUiPrefix: ''
    },
    ignoreUnknownFormats: false
};

swaggerTools.configure(options_object);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, app, function (middleware) {
    // Cross-Origin Resource Sharing

    app.use(cors({
        origin: 'http://localhost:8081',
        methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
        credentials: true
    }));
    //
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    // Validate Swagger requests
    app.use(middleware.swaggerValidator({
        validateResponse: true
    }));

    // // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter({
        swaggerUi: '/openapi.json',
        controllers: './controllers',
        useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
    }));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi({
        apiDocs: '/docs',
        swaggerUi: '/swaggerUI'
    }));

    // Initialize the Swagger middleware
    http.createServer(app).listen(serverPort, function () {
        console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    });
});




