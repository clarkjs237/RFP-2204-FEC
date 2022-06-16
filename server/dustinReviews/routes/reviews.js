const Router = require('express-promise-router');

const {addReview, putHelpful, putReported, getReview, getMeta} = require('../db/index');

const router = new Router();
module.exports = router;

// Add a Review
router.post('/', (req, res) => {
  addReview(req.body)
  .then(
    () => res.sendStatus(201)
    )
  .catch(
    (err) => console.log(err)
    )
})


// Get a Review
router.get('/', (req, res) => {
  let {product_id, page, count, sort} = req.query;
  // filter on possible variables within request
  sort = sort || 'relevant';
  page = page || 0;
  count = count || 5;

  getReview(product_id, page, count, sort)
  .then(
    (results) => res.send(results)
    )
  .catch(
    (err) => console.log(err)
    )
})


// Get Meta
router.get('/meta', (req, res) => {
  let { product_id } = req.query;
  getMeta(product_id)
  .then(
    (results) => res.send(results)
    )
  .catch(
    (err) => console.log(err)
    )
})


// Put helpful
router.put('/:review_id/helpful', (req, res) => {
 putHelpful(req.params.review_id)
  .then(
    () => res.sendStatus(204)
    )
  .catch(
    (err) => console.log(err)
    )
})


// Put Reported
router.put('/:review_id/report', (req, res) => {

  putReported(req.params.review_id)
  .then(
    () => res.sendStatus(204)
    )
  .catch(
    (err) => console.log(err)
    )
})