module.exports = require('../utils/reponseUtils.js');

module.exports = function uuid(prefix) {
    return (prefix + 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}
