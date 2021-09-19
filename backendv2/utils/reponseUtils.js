var utils = require('../utils/writer.js');

const writeResponse = function (statusCode, message, detail) {
    const msg = {
        statusCode: statusCode,
        message: message,
        detail: detail
    };
    return utils.respondWithCode(statusCode, JSON.stringify(msg));
};
exports.responseCreated = function (detail) {
    return writeResponse(201, "Successfully created new Record!", detail);
}

exports.responseDeleted = function (detail) {
    return writeResponse(201, "Successfully deleted Record!", detail);
}

exports.responseError = function (statusCode, message, detail = '') {
    return writeResponse(statusCode, message, detail);
}

exports.responseWithCode = function (statusCode, message, detail) {
    this.statusCode = statusCode;
    this.message = message;
    this.detail = detail;
}

