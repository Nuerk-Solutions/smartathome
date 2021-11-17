const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LogSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    driver: {
        type: String,
        enum: ['Andrea', 'Claudia', 'Oliver', 'Thomas'],
        required: true
    },
    vehicle: {
        type: String,
        enum: ['VW', 'Ferrari'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    reasonForUse: {
        type: String,
        required: true
    },
    mileageBefore: {
        type: Number,
        required: true
    },
    mileageAfter: {
        type: Number,
        required: true
    },
}, {timestamps: true});

const LogbookModel = mongoose.model('LogbookModel', LogSchema, "logbook");
module.exports = LogbookModel;
