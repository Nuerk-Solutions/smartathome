const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
   res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(2086);
console.log("Server Ready!");
