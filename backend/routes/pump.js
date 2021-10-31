const express = require("express");
const {updatePumpState} = require("../utils/requestUtils");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pump:
 *       type: object
 *       required:
 *         - state
 *       properties:
 *         POWER:
 *           type: string
 *           description: The power state of the pump
 *       example:
 *         POWER: OFF
 */

/**
 * @swagger
 * tags:
 *   name: Pump
 *   description: The timers managing API
 */


/**
 * @swagger
 * /pump:
 *   get:
 *     summary: Returns the requested pump power state
 *     tags: [Pump]
 *     parameters:
 *       - name: state
 *         in: query
 *         description: The new pump power state
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The new pump power state is successfully set
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pump'
 */

router.get("/", (req, res) => {
    const state = req.query.state

    updatePumpState(state).then((data) => {
        res.send(data);
    })
});

module.exports = router;
