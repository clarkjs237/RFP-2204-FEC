const express = require('express');
const path = require('path');

// Connect to the db on server start
const db = require('./reviews_sully/db');

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, '../dist')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
