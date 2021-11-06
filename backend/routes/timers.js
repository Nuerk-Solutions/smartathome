const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const createHttpError = require("http-errors");
const {default: axios} = require("axios");
const {updatePumpState} = require("../utils/requestUtils");

const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Timer:
 *       type: object
 *       required:
 *         - duration
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the timer
 *         duration:
 *           type: integer
 *           description: The timer duration in seconds
 *         startDate:
 *           type: integer
 *           description: The timer start date as Unix Timestamp
 *         endDate:
 *           type: integer
 *           description: The timer start date as Unix Timestamp
 *         completed:
 *           type: boolean
 *           description: The timer completion indicator
 *       example:
 *         id: d5fE_asz
 *         duration: 5
 *         startDate: 1635613320
 *         endDate: 1635613325
 *         completed: false
 */

/**
 * @swagger
 * tags:
 *   name: Timers
 *   description: The timers managing API
 */

/**
 * @swagger
 * /pump/timers:
 *   get:
 *     summary: Returns the list of all timers
 *     tags: [Pump, Timers]
 *     responses:
 *       200:
 *         description: The list of the timers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Timer'
 */

router.get("/", (req, res) => {
    const timers = req.app.db.get("timer");

    res.send(timers);
});

/**
 * @swagger
 * /pump/timers/{id}:
 *   get:
 *     summary: Get the timer by id
 *     tags: [Pump, Timers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The timer id
 *     responses:
 *       200:
 *         description: The timer description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Timer'
 *       404:
 *         description: The Timer was not found
 */

router.get("/:id", (req, res, next) => {
    const timer = req.app.db.get("timer").find({ id: req.params.id }).value();

    if(!timer){
        next(createHttpError(500, "The Timer was not found"));
    }

    res.send(timer);
});

/**
 * @swagger
 * /pump/timers:
 *   post:
 *     summary: Create a new timer
 *     tags: [Pump, Timers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Timer'
 *     responses:
 *       200:
 *         description: The timer was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Timer'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res, next) => {
    try {
        const timer = {
            id: nanoid(idLength),
            ...req.body,
            startDate: Date.now(),
            duration: req.body.duration * 1000,
            endDate: Date.now() + req.body.duration,
            completed: false
        };

        req.app.db.get("timer").push(timer).write();


        // updatePumpState("On")
        setTimeout(() => {
            // updatePumpState("Off")
            req.app.db
                .get("timer")
                .find({ id: timer.id })
                .assign({completed: true})
                .write();
        }, req.body.duration);

        res.send(timer)
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /pump/timers/{id}:
 *  put:
 *    summary: Update the timer by the id
 *    tags: [Pump, Timers]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The timer id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Timer'
 *    responses:
 *      200:
 *        description: The timer was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Timer'
 *      404:
 *        description: The timer was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", (req, res, next) => {
    try {
        req.app.db
            .get("timer")
            .find({ id: req.params.id })
            .assign(req.body)
            .write();

        res.send(req.app.db.get("timer").find({ id: req.params.id }));
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /pump/timers/{id}:
 *   delete:
 *     summary: Remove the timer by id
 *     tags: [Pump, Timers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The timer id
 *
 *     responses:
 *       200:
 *         description: The timer was deleted
 *       404:
 *         description: The timer was not found
 */

router.delete("/:id", (req, res) => {
    req.app.db.get("timer").remove({ id: req.params.id }).write();

    res.sendStatus(200);
});

module.exports = router;
