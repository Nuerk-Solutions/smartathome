const {default: axios} = require("axios");


exports.updatePumpState = function (state) {
    axios.get(`${process.env.URL_TASMOTA}&cmnd=Power%20${state}`)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error)
        });
}
