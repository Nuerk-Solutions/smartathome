const {default: axios} = require("axios");


exports.updatePumpState = function (state) {
    return axios.get(`${process.env.URL_TASMOTA}&cmnd=Power%20${state}`)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error)
        });
}
