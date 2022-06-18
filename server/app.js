const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Allow app to use cors for load balancer requests
app.use(cors());
// const port = 8080;
const port = parseInt(process.env.HOSTPORT) || 3000;

app.use(express.static(path.join(__dirname, '../dist')));

// Again not entirely sure, but I think this is important
app.use(express.json());


app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening at ${process.env.PGHOST} on port ${port}`);
  }
});

// This should be fine
//app.get('/hello', (req, res) => res.send('hi'))

// ROUTING FOR ALL ROUTES
const mountAllRoutes = require('./router');

mountAllRoutes(app);

//app.get('/hello', (req, res) => res.send('hello'))

// Adding this for loader.io
app.get('/loaderio-6540b7053e404f8cd0108adf0ae6a791', (req, res) => {
  res.status(200).send('loaderio-6540b7053e404f8cd0108adf0ae6a791');
});
