const express = require('express');
const app = express();
const path = require('path');
const morgan = require("morgan");
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
   res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(2086);
console.log("Server Ready!");
