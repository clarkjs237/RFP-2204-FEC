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
const {
  addReview,
  markHelpful,
  markReported,
  readProduct,
  readProductMeta } = require('./reviews_sully/db');


// ---------------------------------------
//          Creating App Routes
// ---------------------------------------


//                 POST
// ---------------------------------------

// Posting to reviews endpoint
// THIS ADDS A NEW REVIEW
app.post('/reviews', (req, res) => {
  // console.log(req.body); returning this correctly
  addReview(req.body)
  .then(() => res.sendStatus(201))
  .catch((err) => console.error(err))
})


//                  GET
// ---------------------------------------

// This is how I will handle the requests for the product data
app.get('/reviews', (req, res) => {
  // console.log(req.query)
  let {product_id, page, count, sort} = req.query;

  // Set defaults of 1 for page and 5 for count
  // page = page || 0; // I want this to be 0 as default, but it's technically 1 when we return
  page = page || 0;
  count = count || 5;
  sort = sort || 'relevant'; // I think I may want to change this. default should just be id

  let output = {
    product: product_id.toString(),
    page: parseInt(page),
    count: parseInt(count),
    results: []
  }
  readProduct(product_id, page, count, sort)
  .then((results) => {
    // add the results array to the output.results field
    output.results = results;
    // send this output
    res.send(output);
  })
  .catch((err) => console.error(err))

})

app.get('/reviews/meta', (req, res) => {
  let { product_id } = req.query;
  readProductMeta(product_id)
  .then((results) => res.send(results))
  .catch((err) => console.error(err))
})


//                  PUT
// ---------------------------------------

// Marking reviews as helpful or reporting them
app.put('/reviews/:review_id/helpful', (req, res) => {
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