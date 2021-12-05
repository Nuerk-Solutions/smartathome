const express = require("express");
const router = express.Router();

const json = require("../radio.json");
const axios = require("axios");

router.get("/list", (req, res) => {
    res.send(json);
});

router.get("/currentSong/:channel", (req, res) => {

    json.map(channel => {
        if (channel.id === req.params.channel) {
            switch (channel.id) {
                case "nrj_sachsen":
                    fetchData(channel.current_song).then(data => {
                        res.send(data.title + " - " + data.artist);
                    });
                    break;
                case "radio_dresden":
                    fetchData(channel.current_song).then(data => {
                        res.send(data.data.livestream.title + " - " + data.data.livestream.interpret);
                    });
                    break;
                case "radio_dresden_2":
                    fetchData(channel.current_song).then(data => {
                        res.send(data.data.zwei.title + " - " + data.data.zwei.interpret);
                    });
                    break;
                case "freitag_nacht":
                    fetchData(channel.current_song).then(data => {
                        res.send(data.data.freitagnacht.title + " - " + data.data.freitagnacht.interpret);
                    });
                    break;
                case "weihnachtsradio":
                    fetchData(channel.current_song).then(data => {
                        res.send(data.data.weihnachtsradio.title + " - " + data.data.weihnachtsradio.interpret);
                    });
                    break;

            }
        }
    });
});


const fetchData = (url) => {
    return axios.get(url)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
        });
}

module.exports = router;
