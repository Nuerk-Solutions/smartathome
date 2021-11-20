const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VehicleSchema = new Schema({
    _logbookEntry: {
        type: Schema.Types.ObjectId,
        ref: 'LogbookModel'
    },
    typ: {
        type: String,
        enum: ['VW', 'Ferrari'],
        required: true
    },
    currentMileAge: {
        type: Number,
        required: true
    },
    newMileAge: {
        type: Number,
        required: true
    },
}, {timestamps: true});

const VehicleModel = mongoose.model('VehicleModel', VehicleSchema, "vehicle");
module.exports = VehicleModel;
