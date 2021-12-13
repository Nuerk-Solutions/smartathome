const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IngredientSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    }
}, {timestamps: true});

const IngredientModel = mongoose.model('IngredientModel', IngredientSchema, "ingredient");
module.exports = IngredientModel;
