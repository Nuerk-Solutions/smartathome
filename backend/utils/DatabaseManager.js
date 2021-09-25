exports.getItemsFromDB = function (request, database) {
    return request.app.db.get(database)
        .value()
}


exports.getItemById = function (request, database, id) {
    return request.app.db.get(database)
        .find({
            id: id
        })
        .value()
}

exports.deleteItemById = function (request, database, id) {
    return request.app.db.get(database)
        .remove({
            id: id
        })
        .write()
}

exports.setItemValueById = function (request, database, id, valueToChange, newValue) {
    return request.app.db.get(database)
        .find({
            id: id
        })
        .set(valueToChange, newValue)
        .write()
}

exports.updateItemById = function (request, database, id, value) {
    request.app.db.get(database)
        .find({
            id: id
        })
        .assign(value)
        .write()
}

exports.addItemToDB = function (request, database, item) {
    request.app.db.get(database)
        .push(item)
        .write()
}
