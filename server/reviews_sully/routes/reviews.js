const Router = require('express-promise-router');

const {
  addReview,
  markHelpful,
  markReported,
  readProduct,
  readProductMeta
} = require('../db/index');


// Create a new router
const router = new Router();
// Export this router to be used by app
module.exports = router;

// Here is where I will plop all of my routes

// ---------------------------------------
//          Creating App Routes
// ---------------------------------------


//                 POST
// ---------------------------------------

// Posting to reviews endpoint
// THIS ADDS A NEW REVIEW
router.post('/', (req, res) => {
  addReview(req.body)
  .then(() => res.sendStatus(201))
  .catch((err) => console.error(err))
})


//                  GET
// ---------------------------------------

// This is how I will handle the requests for the product data
router.get('/', (req, res) => {
  let {product_id, page, count, sort} = req.query;

  // Set defaults of 1 for page and 5 for count
  // page = page || 0; // I want this to be 0 as default, but it's technically 1 when we return
  page = page || 0;
  count = count || 5;
  sort = sort || 'relevant'; // I think I may want to change this. default should just be id

  readProduct(product_id, page, count, sort)
  .then((results) => res.send(results))
  .catch((err) => console.error(err))
})

router.get('/meta', (req, res) => {
  let { product_id } = req.query;
  readProductMeta(product_id)
  .then((results) => res.send(results))
  .catch((err) => console.error(err))
})


//                  PUT
// ---------------------------------------

// Marking reviews as helpful or reporting them
router.put('/:review_id/helpful', (req, res) => {
  // req.params.review_id is the id we want to update
  markHelpful(req.params.review_id)
  .then(() => res.sendStatus(204))
  .catch((err) => console.error(err))
})

// Marking a review as reported
router.put('/:review_id/report', (req, res) => {

  markReported(req.params.review_id)
  .then(() => res.sendStatus(204))
  .catch((err) => console.error(err))
})