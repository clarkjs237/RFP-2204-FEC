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
const {addReview, markHelpful, markReported} = require('./reviews_sully/db');


// ---------------------------------------
//          Creating App Routes
// ---------------------------------------



// app.get('/tester', (req, res) => {
//   // res.send('hello')
//   testerBoy()
//   .then((results) => res.send(results.rows))
// })

// Posting to reviews endpoint
// THIS ADDS A NEW REVIEW
app.post('/reviews', (req, res) => {
  // console.log(req.body); returning this correctly
  addReview(req.body)
  .then(() => res.sendStatus(201))
  .catch((err) => console.error(err))
})



//                 PUT
// ---------------------------------------

// Marking reviews as helpful or reporting them
app.put('/reviews/:review_id/helpful', (req, res) => {
  // res.send(req.params.review_id)
  // req.params.review_id is the id we want to update
  markHelpful(req.params.review_id)
  .then(() => res.sendStatus(204))
  .catch((err) => console.error(err))
})

// Marking a review as reported
app.put('/reviews/:review_id/report', (req, res) => {

  markReported(req.params.review_id)
  .then(() => res.sendStatus(204))
  .catch((err) => console.error(err))
})