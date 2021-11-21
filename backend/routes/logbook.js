const express = require("express");
const router = express.Router();

const createHttpError = require("http-errors");
const {default: axios} = require("axios");
const Logbook = require("../models/LogbookModel");
const Vehicle = require("../models/VehicleModel");
const XLSX = require("xlsx");
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Logbook:
 *       type: object
 *       required:
 *         - driver
 *         - vehicle
 *         - date
 *         - reasonForUse
 *         - mileageBeforeUse
 *         - mileageAfterUse
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the logbook
 *         driver:
 *           type: string
 *           enum:
 *             - Andrea
 *             - Claudia
 *             - Oliver
 *             - Thomas
 *           description: The driver of the car
 *         vehicle:
 *           type: string
 *           enum:
 *             - VW
 *             - Ferrari
 *           description: The type of vehicle
 *         date:
 *           type: string
 *           description: The date of the logbook entry
 *         reasonForUse:
 *           type: string
 *           description: Quick description of the reason for the use
 *         currentMileage:
 *           type: integer
 *           description: The mileage before the use
 *         newMileage:
 *           type: integer
 *           description: The mileage after the use
 *       example:
 *         driver: Thomas
 *         vehicle: VW
 *         date: 2021-11-17T17:14:47.716+00:00
 *         reasonForUse: Test
 *         mileageBefore: 10000
 *         mileageAfter: 11000
 */

/**
 * @swagger
 * tags:
 *   name: Logbook
 *   description: Logbook operations
 */

/**
 * @swagger
 * /logbook:
 *   get:
 *     summary: Returns the list of all logbook entries
 *     tags: [Logbook]
 *     responses:
 *       200:
 *         description: The list of all logbook entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Logbook'
 */

router.get("/", async (req, res, next) => {

    if (req.query.dl) {
        await Logbook.find().populate("vehicle").exec(function (err, result) {
            if (err) return next(createHttpError(500, err));

            const data = result.map(logbook => {
                return {
                    "ID": logbook._id.toString(),
                    "Fahrer": logbook.driver,
                    "Fahrzeug_Typ": logbook.vehicle.typ,
                    "Fahrzeug_Aktueller_KM_Stand": logbook.vehicle.currentMileAge,
                    "Fahrzeug_Neuer_KM_Stand": logbook.vehicle.newMileAge,
                    "Datum": logbook.date,
                    "Grund": logbook.reasonForUse,
                };
            });

            // console.log(JSON.parse(JSON.stringify(logbook)));
            const workSheet = XLSX.utils.json_to_sheet(data);
            const workBook = XLSX.utils.book_new();


            XLSX.utils.book_append_sheet(workBook, workSheet, "LogBook")
            // Generate buffer
            const buffer = XLSX.write(workBook, {bookType: 'xlsx', type: "buffer"})

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-disposition', 'attachment;filename=' + 'LogBook_' + new Date().toISOString() + '_Language_DE.xlsx');
            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
            res.send(buffer);
            res.end();
        });


        return;
    }

    if(req.query.typ) {
        // VW
        Logbook.find().populate({
            path: "vehicle", match: {
                typ: 'VW'
            }
        }).sort({date: -1}).exec(function (err, result) {
            if (err) return next(createHttpError(500, err));
            result = result.filter(logbook => {
                return logbook.vehicle;
            })[0];
            // Ferrari
            Logbook.find().populate({
                path: "vehicle", match: {
                    typ: 'Ferrari'
                }
            }).sort({date: -1}).exec(function (err, result1) {
                if (err) return next(createHttpError(500, err));
                result1 = result1.filter(logbook => {
                    return logbook.vehicle;
                })[0];
                res.json({result, result1});
            });
            // res.json(result);
        });



    } else {
        Logbook.find().sort({createdAt: req.query.sort}).exec((err, logbook) => {
            if (err) {
                res.status(500).send(err);
            }
            res.json(logbook);
        });
    }
});

/**
 * @swagger
 * /logbook/download:
 *   get:
 *     summary: Download all logbook entries as a XLSX file
 *     tags: [Logbook]
 *     responses:
 *       200:
 *         description: The file of all logbook entries
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */

/**
 * @swagger
 * /logbook/{id}:
 *   get:
 *     summary: Get a logbook entry by id
 *     tags: [Logbook]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The logbook entry id
 *     responses:
 *       200:
 *         description: The logbook entry identified by the id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Logbook'
 *       404:
 *         description: The Logbook was not found
 */

router.get("/:id", (req, res, next) => {
    Logbook.findById(req.params.id).populate("vehicle").exec((err, logbook) => {
        if (err || !logbook) {
            next(createHttpError(404, "Logbook entry not found"));
            return;
        }
        res.json(logbook);
    });
});

/**
 * @swagger
 * /logbook:
 *   post:
 *     summary: Create a logbook entry
 *     tags: [Logbook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Logbook'
 *     responses:
 *       200:
 *         description: The logbook entry was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Logbook'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res, next) => {

    const _id = new mongoose.Types.ObjectId();

    const vehicle = new Vehicle({
        _logbookEntry: _id,
        ...req.body.vehicle
    });

    let logbook = new Logbook({
        _id: _id,
        driver: req.body.driver,
        date: req.body.date,
        reasonForUse: req.body.reasonForUse,
        vehicle: vehicle
    });


    logbook.save((err, logbook) => {
        if (err) {
            next(createHttpError(500, err));
            return;
        }

        vehicle.save((err) => {
            if (err) {
                next(createHttpError(500, err));
                return;
            }
            res.json(logbook);
        });
    });
});

/**
 * @swagger
 * /logbook/{id}:
 *  put:
 *    summary: Update the logbook entry identified by the id
 *    tags: [Logbook]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The logbook entry id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Logbook'
 *    responses:
 *      200:
 *        description: The Logbook was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Logbook'
 *      404:
 *        description: The Logbook was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", (req, res, next) => {
    Logbook.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, logbook) => {
        if (err) {
            next(createHttpError(404, "Logbook not found"));
        }
        res.json(logbook);
    });
});

/**
 * @swagger
 * /logbook/{id}:
 *   delete:
 *     summary: Remove the logbook entry identified by the id
 *     tags: [Logbook]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The logbook entry id
 *
 *     responses:
 *       200:
 *         description: The logbook was deleted
 *       404:
 *         description: The logbook was not found
 */

router.delete("/:id", (req, res, next) => {
    Logbook.findByIdAndRemove(req.params.id, (err, logbook) => {
        if (err) {
            next(createHttpError(404, "Logbook not found"));
        }
        res.json(logbook);
    });
});

module.exports = router;
