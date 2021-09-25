// DB requirements
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const {join} = require("path");

// DB init & default handling
const adapter = new FileSync(join(__dirname, '../db.json'));
const db = low(adapter);


exports.initDatabase = function () {
    db.defaults({jobs: [], timer: []}).write();
    return db;
}

exports.getDatabase = function () {
    return db;
}


exports.getItemsFromDB = function (database) {
    return db.get(database)
        .value()
}


exports.getItemById = function (database, id) {
    return db.get(database)
        .find({
            id: id
        })
        .value()
}

exports.deleteItemById = function (database, id) {
    return db.get(database)
        .remove({
            id: id
        })
        .write()
}

exports.deleteDatabase = function (database) {
    return db.get(database)
        .remove()
        .write()
}

exports.setItemValueById = function (database, id, valueToChange, newValue) {
    return db.get(database)
        .find({
            id: id
        })
        .set(valueToChange, newValue)
        .write()
}

exports.updateItemById = function (database, id, value) {
    db.get(database)
        .find({
            id: id
        })
        .assign(value)
        .write()
}

exports.addItemToDB = function (database, item) {
    db.get(database)
        .push(item)
        .write()
}
