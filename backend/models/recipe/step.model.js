const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StepSchema = new Schema({
    _id: Schema.Types.ObjectId,
    recipe_id: {
        type: Schema.Types.ObjectId,
        ref: 'RecipeModel'
    },
    step: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const StepModel = mongoose.model('StepModel', StepSchema, "steps");
module.exports = StepModel;
