require('dotenv').config();
const expect = require('chai').expect;
const request = require('supertest');
const Logbook = require("../../models/logbook.model");
const Vehicle = require("../../models/vehicle.model");
const AdditionalInformation = require("../../models/logbookAddition.model");
const app = require("../../index.js");

before(function (done) {
    setTimeout(done, 500);
});

let uuid = "";
let lastAddedUuidVW = "";
let lastAddedUuidFerrari = "";

function entry_Without_Additional_Information_1({typ}) {
    return {
        driver: "Thomas",
        date: "2019-01-01T00:00:00.000Z",
        driveReason: "Test_Without_1_" + typ,
        vehicle: {
            typ,
            currentMileAge: 10,
            newMileAge: 20,
            distance: 10,
            cost: (10 * 0.2),
        }
    };
}

// function entry_Without_Additional_Information_Before_1_2({typ}) {
//     return {
//         driver: "Thomas",
//         date: "2018-01-01T00:00:00.000Z",
//         driveReason: "Test_Without_1",
//         vehicle: {
//             typ,
//             currentMileAge: 5,
//             newMileAge: 10,
//             distance: 5,
//             cost: (5 * 0.2),
//         }
//     };
// }

function entry_With_Additional_Information_Fuel_1({typ}) {
    return {
        driver: "Thomas",
        date: "2019-01-01T00:00:00.000Z",
        driveReason: "Test_Fuel_1_" + typ,
        vehicle: {
            typ,
            currentMileAge: 20,
            newMileAge: 40,
            distance: 20,
            cost: (20 * 0.2),
        },
        additionalInformation: {
            informationTyp: "Getankt",
            information: 60.5
        }
    };
}

function entry_With_Additional_Information_Service_1({typ}) {
    return {
        driver: "Thomas",
        date: "2019-01-01T00:00:00.000Z",
        driveReason: "Test_Service_1_" + typ,
        vehicle: {
            typ,
            currentMileAge: 40,
            newMileAge: 70,
            distance: 30,
            cost: (30 * 0.2),
        },
        additionalInformation: {
            informationTyp: "Gewartet",
            information: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
        }
    };
}

function entry_Without_Additional_Information_2({typ}) {
    return {
        driver: "Thomas",
        date: "2020-01-01T00:00:00.000Z",
        driveReason: "Test_Without_2_" + typ,
        vehicle: {
            typ,
            currentMileAge: 70,
            newMileAge: 90,
            distance: 20,
            cost: (20 * 0.2),
        }
    };
}



function entry_With_Additional_Information_Fuel_2({typ}) {
    return {
        driver: "Thomas",
        date: "2020-01-01T00:00:00.000Z",
        driveReason: "Test_Fuel_2_" + typ,
        vehicle: {
            typ,
            currentMileAge: 90,
            newMileAge: 100,
            distance: 10,
            cost: (10 * 0.2),
        },
        additionalInformation: {
            informationTyp: "Getankt",
            information: 40
        }
    };
}

function entry_Without_Additional_Information_3({typ}) {
    return {
        driver: "Thomas",
        date: "2021-01-01T00:00:00.000Z",
        driveReason: "Test_Without_3_" + typ,
        vehicle: {
            typ,
            currentMileAge: 100,
            newMileAge: 150,
            distance: 50,
            cost: (50 * 0.2),
        }
    };
}

function entry_With_Additional_Information_Fuel_3({typ}) {
    return {
        driver: "Thomas",
        date: "2021-01-01T00:00:00.000Z",
        driveReason: "Test_Fuel_3_" + typ,
        vehicle: {
            typ,
            currentMileAge: 150,
            newMileAge: 160,
            distance: 10,
            cost: (10 * 0.2),
        },
        additionalInformation: {
            informationTyp: "Getankt",
            information: 20
        }
    };
}


describe("Logbook Route", () => {
    // Check VW Entries
    it("should add a new lookbook entry with no additional Information VW 1", (done) => {

        const entry = entry_Without_Additional_Information_1({typ: "VW"});
        request(app)
            .post("/logbook")
            .send(entry)
            .expect(201)
            .then((res) => {
                console.log(res.body.vehicle.newMileAge - res.body.vehicle.currentMileAge);
                expect(res.body).to.be.an('object');
                expect(res.body.driver).to.be.equal("Thomas");
                expect(res.body.date).to.be.equal("2019-01-01T00:00:00.000Z");
                expect(res.body.driveReason).to.be.equal("Test_Without_1_VW");
                expect(res.body.vehicle.typ).to.be.equal("VW");
                expect(res.body.vehicle.currentMileAge).to.be.equal(10);
                expect(res.body.vehicle.newMileAge).to.be.equal(20);
                expect(res.body.vehicle.distance).to.be.equal(10);
                expect(res.body.vehicle.cost).to.be.equal(10 * 0.2);
                expect(res.body.additionalInformation).to.be.null;
                uuid = res.body._id;
                lastAddedUuidVW = res.body._id;
                done();
            })
            .catch((err) => done(err));
    });

    // Check if the last added entry is the same as the one we just added
    it("should return the last added entry", (done) => {
        request(app)
            .get("/logbook")
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('array').length(2);
                expect(res.body[0]._id).to.be.equal(lastAddedUuidVW);
                expect(res.body[0]._id).to.be.equal(uuid);
                done();
            })
            .catch((err) => done(err));
    });

    it("should add a new lookbook entry with additional Information Fuel VW 1", (done) => {
        const entry = entry_With_Additional_Information_Fuel_1({typ: "VW"});
        request(app)
            .post("/logbook")
            .send(entry)
            .expect(201)
            .then((res) => {
                console.log(res.body.vehicle.newMileAge - res.body.vehicle.currentMileAge);
                expect(res.body).to.be.an('object');
                expect(res.body.driver).to.be.equal("Thomas");
                expect(res.body.date).to.be.equal("2019-01-01T00:00:00.000Z");
                expect(res.body.driveReason).to.be.equal("Test_Fuel_1_VW");
                expect(res.body.vehicle.typ).to.be.equal("VW");
                expect(res.body.vehicle.currentMileAge).to.be.equal(20);
                expect(res.body.vehicle.newMileAge).to.be.equal(40);
                expect(res.body.vehicle.distance).to.be.equal(20);
                expect(res.body.vehicle.cost).to.be.equal(20 * 0.2);
                expect(res.body.additionalInformation).to.be.not.null;
                expect(res.body.additionalInformation.distanceSinceLastInformation).to.be.equal(0);
                expect(res.body.additionalInformation.informationTyp).to.be.equal('Getankt');
                expect(res.body.additionalInformation.information).to.be.equal('60.5');
                lastAddedUuidVW = res.body._id;
                done();
            })
            .catch((err) => done(err));
    });

    // Check if the last added entry is the same as the one we just added
    it("should return the last added entry", (done) => {
        request(app)
            .get("/logbook")
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('array').length(2);
                expect(res.body[0]._id).to.be.equal(lastAddedUuidVW);
                expect(res.body[0]._id).to.be.not.equal(uuid);
                done();
            })
            .catch((err) => done(err));
    });

    it("should add a new lookbook entry with additional Information Service VW 1", (done) => {
        const entry = entry_With_Additional_Information_Service_1({typ: "VW"});
        request(app)
            .post("/logbook")
            .send(entry)
            .expect(201)
            .then((res) => {
                console.log(res.body.vehicle.newMileAge - res.body.vehicle.currentMileAge);
                expect(res.body).to.be.an('object');
                expect(res.body.driver).to.be.equal("Thomas");
                expect(res.body.date).to.be.equal("2019-01-01T00:00:00.000Z");
                expect(res.body.driveReason).to.be.equal("Test_Service_1_VW");
                expect(res.body.vehicle.typ).to.be.equal("VW");
                expect(res.body.vehicle.currentMileAge).to.be.equal(40);
                expect(res.body.vehicle.newMileAge).to.be.equal(70);
                expect(res.body.vehicle.distance).to.be.equal(30);
                expect(res.body.vehicle.cost).to.be.equal(30 * 0.2);
                expect(res.body.additionalInformation).to.be.not.null;
                expect(res.body.additionalInformation.distanceSinceLastInformation).to.be.equal(0);
                expect(res.body.additionalInformation.informationTyp).to.be.equal("Gewartet");
                expect(res.body.additionalInformation.information).to.be.not.null;
                lastAddedUuidVW = res.body._id;
                done();
            })
            .catch((err) => done(err));
    });

    // Check if the last added entry is the same as the one we just added
    it("should return the last added entry", (done) => {
        request(app)
            .get("/logbook")
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('array').length(2);
                expect(res.body[0]._id).to.be.equal(lastAddedUuidVW);
                expect(res.body[0]._id).to.be.not.equal(uuid);
                done();
            })
            .catch((err) => done(err));
    });

    // Logbook and Vehicle should contain 3 entries
    it("should return 3 entries", (done) => {
        request(app)
            .get("/logbook?all=1")
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('array').length(3);
                done();
            })
            .catch((err) => done(err));
    });

    it('Get Entry by Id', (done) => {
        request(app)
            .get("/logbook/" + uuid)
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('object');
                expect(res.body.driver).to.be.equal("Thomas");
                expect(res.body.date).to.be.equal("2019-01-01T00:00:00.000Z");
                expect(res.body.driveReason).to.be.equal("Test_Without_1_VW");
                expect(res.body.vehicle.typ).to.be.equal("VW");
                expect(res.body.vehicle.currentMileAge).to.be.equal(10);
                expect(res.body.vehicle.newMileAge).to.be.equal(20);
                expect(res.body.vehicle.distance).to.be.equal(10);
                expect(res.body.vehicle.cost).to.be.equal(10 * 0.2);
                done();
            })
            .catch((err) => done(err));
    });


    it("should add a new lookbook entry with no additional Information VW 2", (done) => {

        const entry = entry_Without_Additional_Information_2({typ: "VW"});
        request(app)
            .post("/logbook")
            .send(entry)
            .expect(201)
            .then((res) => {
                console.log(res.body.vehicle.newMileAge - res.body.vehicle.currentMileAge);
                expect(res.body).to.be.an('object');
                expect(res.body.driver).to.be.equal("Thomas");
                expect(res.body.date).to.be.equal("2020-01-01T00:00:00.000Z");
                expect(res.body.driveReason).to.be.equal("Test_Without_2_VW");
                expect(res.body.vehicle.typ).to.be.equal("VW");
                expect(res.body.vehicle.currentMileAge).to.be.equal(70);
                expect(res.body.vehicle.newMileAge).to.be.equal(90);
                expect(res.body.vehicle.distance).to.be.equal(20);
                expect(res.body.vehicle.cost).to.be.equal(20 * 0.2);
                expect(res.body.additionalInformation).to.be.null;
                uuid = res.body._id;
                lastAddedUuidVW = res.body._id;
                done();
            })
            .catch((err) => done(err));
    });



    // Check Ferrari Entries
    it("should add a new lookbook entry with no additional Information Ferrari 1", (done) => {

        const entry = entry_Without_Additional_Information_1({typ: "Ferrari"});
        request(app)
            .post("/logbook")
            .send(entry)
            .expect(201)
            .then((res) => {
                expect(res.body).to.be.an('object').does.includes.any.keys({
                    ...entry,
                    additionalInformation: null,
                    vehicle: {
                        ...entry.vehicle,
                        _logbookEntry: null,
                    }
                });
                uuid = res.body._id;
                lastAddedUuidFerrari = res.body._id;
                expect(res.body.additionalInformation).to.be.null;
                done();
            })
            .catch((err) => done(err));
    });

    // Check if the last added entry is the same as the one we just added
    it("should return the last added entry", (done) => {
        request(app)
            .get("/logbook")
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('array').length(2);
                expect(res.body[0]._id).to.be.equal(lastAddedUuidVW);
                expect(res.body[1]._id).to.be.equal(lastAddedUuidFerrari);
                expect(res.body[1]._id).to.be.equal(uuid);
                done();
            })
            .catch((err) => done(err));
    });

    it("should add a new lookbook entry with additional Information Fuel Ferrari 1", (done) => {
        const entry = entry_With_Additional_Information_Fuel_1({typ: "Ferrari"});
        request(app)
            .post("/logbook")
            .send(entry)
            .expect(201)
            .then((res) => {
                expect(res.body).to.be.an('object').does.includes.any.keys({
                    ...entry,
                    vehicle: {
                        ...entry.vehicle,
                        _logbookEntry: null,
                    }
                });
                lastAddedUuidFerrari = res.body._id;
                expect(res.body.additionalInformation).to.be.not.null;
                expect(res.body.additionalInformation.distanceSinceLastInformation).to.be.equal(0);
                done();
            })
            .catch((err) => done(err));
    });

    // Check if the last added entry is the same as the one we just added
    it("should return the last added entry", (done) => {
        request(app)
            .get("/logbook")
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('array').length(2);
                expect(res.body[0]._id).to.be.equal(lastAddedUuidVW);
                expect(res.body[1]._id).to.be.equal(lastAddedUuidFerrari);
                expect(res.body[1]._id).to.be.not.equal(uuid);
                done();
            })
            .catch((err) => done(err));
    });

    it("should add a new lookbook entry with additional Information Service Ferrari 1", (done) => {
        const entry = entry_With_Additional_Information_Service_1({typ: "Ferrari"});
        request(app)
            .post("/logbook")
            .send(entry)
            .expect(201)
            .then((res) => {
                expect(res.body).to.be.an('object').does.includes.any.keys({
                    ...entry,
                    vehicle: {
                        ...entry.vehicle,
                        _logbookEntry: null,
                    }
                });
                lastAddedUuidFerrari = res.body._id;
                expect(res.body.additionalInformation).to.be.not.null;
                expect(res.body.additionalInformation.distanceSinceLastInformation).to.be.equal(0);
                done();
            })
            .catch((err) => done(err));
    });

    // Check if the last added entry is the same as the one we just added
    it("should return the last added entry", (done) => {
        request(app)
            .get("/logbook")
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('array').length(2);
                expect(res.body[0]._id).to.be.equal(lastAddedUuidVW);
                expect(res.body[1]._id).to.be.equal(lastAddedUuidFerrari);
                expect(res.body[1]._id).to.be.not.equal(uuid);
                done();
            })
            .catch((err) => done(err));
    });

    // Logbook and Vehicle should contain 3 entries
    it("should return 6 entries", (done) => {
        request(app)
            .get("/logbook?all=1")
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('array').length(7);
                done();
            })
            .catch((err) => done(err));
    });

    it('Get Entry by Id', (done) => {
        request(app)
            .get("/logbook/" + uuid)
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('object');
                expect(res.body.driver).to.be.equal("Thomas");
                expect(res.body.date).to.be.equal("2019-01-01T00:00:00.000Z");
                expect(res.body.driveReason).to.be.equal("Test_Without_1_Ferrari");
                expect(res.body.vehicle.typ).to.be.equal("Ferrari");
                expect(res.body.vehicle.currentMileAge).to.be.equal(10);
                expect(res.body.vehicle.newMileAge).to.be.equal(20);
                expect(res.body.vehicle.distance).to.be.equal(10);
                expect(res.body.vehicle.cost).to.be.equal(10 * 0.2);
                done();
            })
            .catch((err) => done(err));
    });


    // Check if additional information distance is calculated by the last entry of the same typ

    it("should add a new lookbook entry with additional Information Fuel VW 2", (done) => {
        const entry = entry_With_Additional_Information_Fuel_2({typ: "VW"});
        request(app)
            .post("/logbook")
            .send(entry)
            .expect(201)
            .then((res) => {
                expect(res.body).to.be.an('object').does.includes.any.keys({
                    ...entry,
                    vehicle: {
                        ...entry.vehicle,
                        _logbookEntry: null,
                    }
                });
                lastAddedUuidVW = res.body._id;
                expect(res.body.additionalInformation).to.be.not.null;
                expect(res.body.additionalInformation.distanceSinceLastInformation).to.be.equal(80);
                done();
            })
            .catch((err) => done(err));
    });

    it("should add a new lookbook entry with no additional Information VW 3", (done) => {

        const entry = entry_Without_Additional_Information_3({typ: "VW"});
        request(app)
            .post("/logbook")
            .send(entry)
            .expect(201)
            .then((res) => {
                console.log(res.body.vehicle.distance)
                expect(res.body).to.be.an('object');
                expect(res.body.driver).to.be.equal("Thomas");
                expect(res.body.date).to.be.equal("2021-01-01T00:00:00.000Z");
                expect(res.body.driveReason).to.be.equal("Test_Without_3_VW");
                expect(res.body.vehicle.typ).to.be.equal("VW");
                expect(res.body.vehicle.currentMileAge).to.be.equal(100);
                expect(res.body.vehicle.newMileAge).to.be.equal(150);
                expect(res.body.vehicle.distance).to.be.equal(50);
                expect(res.body.vehicle.cost).to.be.equal(50 * 0.2);
                expect(res.body.additionalInformation).to.be.null;
                uuid = res.body._id;
                lastAddedUuidVW = res.body._id;
                done();
            })
            .catch((err) => done(err));
    });

    it("should add a new lookbook entry with additional Information Fuel VW 3", (done) => {
        const entry = entry_With_Additional_Information_Fuel_3({typ: "VW"});
        request(app)
            .post("/logbook")
            .send(entry)
            .expect(201)
            .then((res) => {
                expect(res.body).to.be.an('object').does.includes.any.keys({
                    ...entry,
                    vehicle: {
                        ...entry.vehicle,
                        _logbookEntry: null,
                    }
                });
                lastAddedUuidVW = res.body._id;
                expect(res.body.additionalInformation).to.be.not.null;
                expect(res.body.additionalInformation.distanceSinceLastInformation).to.be.equal(60);
                done();
            })
            .catch((err) => done(err));
    });

    // // Check previous added entry
    // // VW
    // it("should add a new lookbook entry with no additional Information VW Before 1 2", (done) => {
    //
    //     const entry = entry_Without_Additional_Information_Before_1_2({typ: "VW"});
    //     request(app)
    //         .post("/logbook")
    //         .send(entry)
    //         .expect(201)
    //         .then((res) => {
    //             expect(res.body).to.be.an('object').does.includes.any.keys({
    //                 ...entry,
    //                 additionalInformation: null,
    //                 vehicle: {
    //                     ...entry.vehicle,
    //                     _logbookEntry: null,
    //                 }
    //             });
    //             uuid = res.body._id;
    //             expect(res.body.additionalInformation).to.be.null;
    //             done();
    //         })
    //         .catch((err) => done(err));
    // });
    //
    // // Check if the last added entry is the same as the one we just added
    // it("should return the last added entry", (done) => {
    //     request(app)
    //         .get("/logbook")
    //         .expect(200)
    //         .then((res) => {
    //             expect(res.body).to.be.an('array').length(2);
    //             expect(res.body[0]._id).to.be.not.equal(uuid);
    //             expect(res.body[0]._id).to.be.equal(lastAddedUuidVW);
    //             done();
    //         })
    //         .catch((err) => done(err));
    // });

});

after(async function () {
    try {
        await Logbook.deleteMany({});
        await AdditionalInformation.deleteMany({});
        await Vehicle.deleteMany({});
    } catch (e) {
        console.error(e);
    }
});
