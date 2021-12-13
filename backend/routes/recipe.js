const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe/recipe.model");
const Ingredient = require("../models/recipe/ingredient.model");
const Step = require("../models/recipe/step.model");
const createHttpError = require("http-errors");


router.get("/list", (req, res, next) => {

    // Get all recipes, populate them with ingredients and steps and send them back to the client
    Recipe.find({})
        .populate("ingredients")
        .populate("steps")
        .exec((err, recipes) => {
            if (err) {
                next(createHttpError(500, err));
            } else {
                res.status(200).send(recipes);
            }
        });
});

router.get("/:id", (req, res) => {

});

router.post("/", (req, res) => {

    // Create an array of ingredients from body ingredients
    const ingredients = req.body.ingredients.map(item => {
        let ingredient = new Ingredient({
            name: item.name,
            amount: item.amount,
            quantity: item.quantity,
            unit: item.unit
        });
        ingredient.save();
        return ingredient;
    });


    // Create an array of steps from body steps
    const steps = req.body.steps.map(item => {
        let step = new Step({
            step: item.step,
            name: item.name,
            description: item.description,
        });
    });
    steps.save();

    const recipe = new Recipe({
        name: req.body.name,
        author: req.body.author,
        duration: req.body.duration,
        description: req.body.description,
        ingredients: ingredients,
        steps: steps,
        image: req.body.image
    });
    recipe.save().then(r => res.send(r));

});

router.delete("/:id", (req, res) => {

});


module.exports = router;
