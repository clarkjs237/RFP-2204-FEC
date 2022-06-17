const express = require('express');
const path = require('path');

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, '../dist')));

// Again not entirely sure, but I think this is important
app.use(express.json());


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/hello', (req, res) => res.send('hello!'))

// ROUTING FOR ALL ROUTES
const mountAllRoutes = require('./router');

mountAllRoutes(app);