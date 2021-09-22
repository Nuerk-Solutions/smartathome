var utils = require('../utils/writer.js');

const writeResponse = function (statusCode, message, detail) {
    const msg = {
        statusCode: statusCode,
        message: message,
        detail: detail
    };
    return utils.respondWithCode(statusCode, JSON.stringify(msg));
};

const writeResponseWithJson = function (statusCode, json) {
    return utils.respondWithCode(statusCode, json);
};

exports.responseCreated = function (detail) {
    return writeResponse(201, "Successfully created new Record!", detail);
}

exports.responseDeleted = function (detail) {
    return writeResponse(200, "Successfully deleted Record!", detail);
}

exports.responseWithCode = function (statusCode, message, detail = '') {
    return writeResponse(statusCode, message, detail);
}

exports.responseWithJson = function (statusCode, json) {
    return writeResponseWithJson(statusCode, JSON.stringify(json));
}

