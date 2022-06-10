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


// Import the CRUD functions from the db on server start
const {testerBoy, addReview} = require('./reviews_sully/db');


// testerBoy()
// .then((res) => console.log(res.rows))

// bananaBoat()
// .then((res) => console.log(res.rows))



// ---------------------------------------
//          Creating App Routes
// ---------------------------------------



app.get('/tester', (req, res) => {
  // res.send('hello')
  testerBoy()
  .then((results) => res.send(results.rows))
})

// Posting to reviews endpoint
app.post('/reviews', (req, res) => {
  // console.log(req.body); returning this correctly
  addReview(req.body)

  res.send('tester');
})
