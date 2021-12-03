const express = require("express");
const router = express.Router();

const json = require("../radio.json");

router.get("/list", (req, res) => {
    res.send(json);
});

module.exports = router;
