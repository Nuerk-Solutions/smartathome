const express = require('express');
const app = express();
const path = require('path');
const morgan = require("morgan");
const cors = require('cors');
const request = require('request');
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/pump/:state', function (req, res) {
	request('http://nuerk.dynv6.net/cm?user=admin&password=Tasmota2021!&cmnd=Power%20' + req.params.state, function (error, response, body) {
		console.error('error:', error); // Print the error if one occurred
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		console.log('body:', body); // Print the HTML for the Google homepage.
		res.end(body);
	});
})

app.get('/*', function(req, res, next) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(2086);
console.log("Server Ready!");
