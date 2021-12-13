const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RecipeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: [{
        type: Schema.Types.ObjectId,
        ref: 'IngredientModel',
        required: true
    }],
    steps: [{
        type: Schema.Types.ObjectId,
        ref: 'StepModel',
        required: true
    }],
    image: {
        type: String,
        required: true
    }
}, {timestamps: true});

const RecipeModel = mongoose.model('RecipeModel', RecipeSchema, "recipes");
module.exports = RecipeModel;
