const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdditionalInformationSchema = new Schema({
    _logbookEntry: {
        type: Schema.Types.ObjectId,
        ref: 'LogbookModel'
    },
    informationTyp: {
        type: String,
        enum: ['Getankt', 'Gewartet']
    },
    information: {
        type: String
    },
    cost: {
        type: String
    },
    distanceSinceLastInformation: {
        type: Number
    },
}, {timestamps: true});

const AdditionalInformationModel = mongoose.model('AdditionalInformationModel', AdditionalInformationSchema, "additionalInformation");
module.exports = AdditionalInformationModel;
