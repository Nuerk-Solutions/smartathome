
const express = require('express');
const jsyaml = require("js-yaml");
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const OpenApiValidator = require('express-openapi-validator');
var oas3Tools = require('oas3-tools');
var serverPort = 8080;

const fs = require("fs");
const oasTools = require("oas-tools");
const apiSpec = fs.readFileSync(path.join(__dirname, './api/openapi.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(apiSpec);
var app = express();
app.use(bodyParser.json({
    strict: false
}));
// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};



var options_object = {
    controllers: path.join(__dirname, './controllers'),
    loglevel: 'debug',
    // loglevel: 'none',
    strict: true,
    router: true,
    validator: true,
    ignoreUnknownFormats: true
};
oasTools.configure(options_object);

oasTools.initialize(oasDoc, app, () => {
    http.createServer(app).listen(serverPort, function () {
        console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);

    });
});


// var expressAppConfig = oas3Tools.expressAppConfig(apiSpec, options);
// var app = expressAppConfig.getApp();

// const app = express();
// console.log(apiSpec);
// var cors = require('cors');
// var swaggerTools = require('oas-tools');

// Local DB requirements
// const low = require("lowdb");
// const FileSync = require("lowdb/adapters/FileSync");
const {join} = require('path');

// Local DB inits
// const adapter = new FileSync(join(__dirname,'..','db.json'));
// const db = low(adapter);
// db.defaults({ tasks:[] }).write();

// const jsyaml = require("js-yaml");

// app.db = db;



module.exports = app;



