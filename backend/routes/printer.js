const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const router = express.Router();

router.get("/", (req, res) => {

    const params = new URLSearchParams();
    params.append('GETINFO', '0');
    axios({
        method: 'post',
        url: 'http://printer.nuerk.dynv6.net/rui/prninfo_data.cgi',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*'
        },
        data: params
    }).then(response => {
        xml2js.parseString(response.data, (err, result) => {
            if(err) {
                throw err;
            }
            const json = JSON.stringify(result);
            res.send(json);
        });
    }).catch(error => {
        console.log(error);
    });
});

module.exports = router;
