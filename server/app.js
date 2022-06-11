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
  readProduct} = require('./reviews_sully/db');


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


// {
//   "product": "2",
//   "page": 0,
//   "count": 5,
//   "results": [
//     {
//       "review_id": 5,
//       "rating": 3,
//       "summary": "I'm enjoying wearing these shades",
//       "recommend": false,
//       "response": null,
//       "body": "Comfortable and practical.",
//       "date": "2019-04-14T00:00:00.000Z",
//       "reviewer_name": "shortandsweeet",
//       "helpfulness": 5,
//       "photos": [{
//           "id": 1,
//           "url": "urlplaceholder/review_5_photo_number_1.jpg"
//         },
//         {
//           "id": 2,
//           "url": "urlplaceholder/review_5_photo_number_2.jpg"
//         },
//         // ...
//       ]
//     },


// From reviews_arr
// [
//   {
//     "id": 5774946,
//     "product_id": 1000011,
//     "rating": 4,
//     "date": "2021-04-23T02:01:55.000Z",
//     "summary": "Sed ut aut rerum veritatis quis veritatis tempore.",
//     "body": "Quos provident voluptatem sed vel dolores. Provident porro assumenda totam. Tempore aperiam eos nam.",
//     "recommend": true,
//     "reported": false,
//     "reviewer_name": "Gwen.Stracke68",
//     "reviewer_email": "Aletha64@yahoo.com",
//     "response": null,
//     "helpfulness": 3,
//     "photos": []
// },


//                  GET
// ---------------------------------------

// This is how I will handle the requests for the product data
app.get('/reviews', (req, res) => {
  // console.log(req.query)
  let {product_id, page, count, sort} = req.query;

  // Set defaults of 1 for page and 5 for count
  // page = page || 0; // I want this to be 0 as default, but it's technically 1 when we return
  // page = page - 1 || 0;
  count = count || 5;
  sort = sort || 'relevant'; // I think I may want to change this. default should just be id

  readProduct(product_id, page - 1 || 0, count, sort)
  .then((result) => {
    res.send(result)
    // res.send(result.photos_arr)
  })

  // res.send('hello reviews')
})

app.get('/reviews/meta', (req, res) => {
  console.log(req.query); // this should only be product_id

  res.send('hello reviews meta')
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