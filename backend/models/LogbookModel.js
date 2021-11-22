const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LogSchema = new Schema({
    _id: Schema.Types.ObjectId,
    driver: {
        type: String,
        enum: ['Andrea', 'Claudia', 'Oliver', 'Thomas'],
        required: true
    },
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'VehicleModel'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    reasonForUse: {
        type: String,
        required: true
    },
    additionalInformation: {
        type: Schema.Types.ObjectId,
        ref: 'LogbookFuelModel'
    }
}, {timestamps: true});

const LogbookModel = mongoose.model('LogbookModel', LogSchema, "logbook");
module.exports = LogbookModel;
