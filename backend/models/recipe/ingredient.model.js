const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IngredientSchema = new Schema({
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
});

const IngredientModel = mongoose.model('IngredientModel', IngredientSchema, "ingredients");
module.exports = IngredientModel;
