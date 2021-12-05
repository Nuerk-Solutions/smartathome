const express = require("express");
const router = express.Router();

const createHttpError = require("http-errors");
const Logbook = require("../models/logbook.model");
const Vehicle = require("../models/vehicle.model");
const AdditionalInformation = require("../models/logbookAddition.model");
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
        await Logbook.find().populate("vehicle").populate("additionalInformation").exec(function (err, result) {
            if (err) return next(createHttpError(500, err));

            const data = result.map(logbook => {
                return {
                    "Fahrer": logbook.driver,
                    "Fahrzeug_Typ": logbook.vehicle.typ,
                    "Aktueller Kilometerstand": logbook.vehicle.currentMileAge,
                    "Neuer Kilometerstand": logbook.vehicle.newMileAge,
                    "Entfernung": logbook.vehicle.distance,
                    "Kosten": logbook.vehicle.cost,
                    "Datum": logbook.date,
                    "Grund": logbook.driveReason,
                    "Zusatzinformationen - Art": logbook.additionalInformation ? logbook.additionalInformation.informationTyp : "",
                    "Zusatzinformationen - Inhalt": logbook.additionalInformation ? logbook.additionalInformation.information : "",
                    "Entfernung seit letzter Information": logbook.additionalInformation ? logbook.additionalInformation.distanceSinceLastInformation : "",
                    "": "",
                    "_id": logbook._id.toString(),
                    "createdAt": logbook.createdAt.toString(),
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

    if (req.query.all) {
        await Logbook.find().populate("vehicle").populate("additionalInformation").exec(function (err, result) {
            if (err) return next(createHttpError(500, err));
            res.json(result);
        });
        return;
    }

    // VW
    Logbook.find().populate({
        path: "vehicle", match: {
            typ: 'VW'
        }
    }).sort({createdAt: -1}).exec(function (err, vw) {
        if (err) return next(createHttpError(500, err));
        vw = vw.filter(logbook => {
            return logbook.vehicle;
        })[0];
        // Ferrari
        Logbook.find().populate({
            path: "vehicle", match: {
                typ: 'Ferrari'
            }
        }).sort({createdAt: -1}).exec(function (err, ferrari) {
            if (err) return next(createHttpError(500, err));
            ferrari = ferrari.filter(logbook => {
                return logbook.vehicle;
            })[0];

            res.json([vw, ferrari]);
        });
        // res.json(result);
    });


    //     Logbook.find().populate('vehicle').populate("additionalInformation").exec((err, logbook) => {
    //         if (err) {
    //             res.status(500).send(err);
    //         }
    //         res.json(logbook);
    //     });
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
    Logbook.findById(req.params.id).populate("vehicle").populate("additionalInformation").exec((err, logbook) => {
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

router.post("/", async (req, res, next) => {

    try {
        const _id = new mongoose.Types.ObjectId();

        // Create normal vehicle with values
        const vehicle = new Vehicle({
            _logbookEntry: _id,
            distance: Number(req.body.vehicle.newMileAge - req.body.vehicle.currentMileAge).toFixed(2),
            cost: Number((req.body.vehicle.newMileAge - req.body.vehicle.currentMileAge) * 0.20).toFixed(2),
            ...req.body.vehicle
        });

        let additionalInformation = new AdditionalInformation({
            _logbookEntry: _id,
            distanceSinceLastInformation: 0
        });


        if (req.body.additionalInformation != null) {

            // Get Last Additional Information and populate with Logbook Entry
            const lastAdditionalInformationLog = await AdditionalInformation.findOne().sort({createdAt: -1}).populate("_logbookEntry", "", "LogbookModel");
            let lastAdditionalInformationVehicle = null;

            if (lastAdditionalInformationLog != null) {
                lastAdditionalInformationVehicle = await Vehicle.findOne({_id: lastAdditionalInformationLog._logbookEntry.vehicle}).populate("_logbookEntry", "", "LogbookModel");
                if (req.body.vehicle.typ === lastAdditionalInformationVehicle.typ) {

                    additionalInformation = new AdditionalInformation({
                        _logbookEntry: _id,
                        distanceSinceLastInformation: lastAdditionalInformationVehicle && Number(req.body.vehicle.newMileAge - lastAdditionalInformationVehicle.newMileAge) || 0,
                        ...req.body.additionalInformation
                    });
                }
            }

            // if (lastAdditionalInformationLog != null && req.body.vehicle.typ === lastAdditionalInformationLog.vehicle.typ) {
            //     lastAdditionalInformationVehicle = await Vehicle.findOne({_id: lastAdditionalInformationLog._logbookEntry.vehicle}).populate("_logbookEntry", "", "LogbookModel");
            //
            //     additionalInformation = new AdditionalInformation({
            //         _logbookEntry: _id,
            //         distanceSinceLastInformation: lastAdditionalInformationVehicle && Number(req.body.vehicle.newMileAge - lastAdditionalInformationVehicle.newMileAge) || 0,
            //         ...req.body.additionalInformation
            //     });
            // } else {
            //     additionalInformation = new AdditionalInformation({
            //         _logbookEntry: _id,
            //         distanceSinceLastInformation: 0,
            //         ...req.body.additionalInformation
            //     });
            // }
        }

        // ._logbookEntry.additionalInformation
        let logbook = new Logbook({
            _id: _id,
            driver: req.body.driver,
            date: req.body.date,
            driveReason: req.body.driveReason,
            vehicle: vehicle,
            additionalInformation: req.body.additionalInformation && additionalInformation || null,
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
                if (req.body.additionalInformation == null) {
                    res.status(201).json(logbook);
                    return;
                }
                additionalInformation.save((err) => {
                    if (err) {
                        next(createHttpError(500, err));
                        return;
                    }
                    res.status(201).json(logbook);
                });
            });
        });
    } catch (e) {
        next(createHttpError(500, e));
    }
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

router.delete("/:id", async (req, res, next) => {

    // if req.params.last then delete the last added logbook entry
    if (req.params.id === "last") {
        Logbook.findOneAndDelete({}).sort({createdAt: -1}).exec((err, logbook) => {
            if (logbook === null) {
                next(createHttpError(404, "Logbook not found"));
                return;
            }
            if (err) {
                next(createHttpError(500, err));
                return;
            }
            Vehicle.findByIdAndDelete(logbook.vehicle).exec((err, vehicle) => {
                if (err) {
                    next(createHttpError(500, err));
                }
            });

            AdditionalInformation.findOneAndRemove(logbook.additionalInformation).exec((err, additionalInformation) => {
                if (err) {
                    next(createHttpError(500, err));
                }

            });
            res.send("Deleted Last");
        });
        return;
    }

    Logbook.findByIdAndDelete(req.params.id).exec((err, logbook) => {
        if (err) {
            next(createHttpError(404, "Logbook not found"));
        }
        Vehicle.findByIdAndDelete(logbook.vehicle).exec((err, vehicle) => {
            if (err) {
                next(createHttpError(404, "Logbook not found"));
            }
        });
        AdditionalInformation.findOneAndRemove(logbook.additionalInformation).exec((err, additionalInformation) => {
            if (err) {
                next(createHttpError(404, "Logbook not found"));
            }
        });
        res.send("Deleted");
    });
});

module.exports = router;
