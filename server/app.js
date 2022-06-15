const express = require('express');
const path = require('path');

// const db = require('./db');

const app = express();
const port = 8080;

app.use(express.json())

const {
  addReview, putHelpful, putReport, getReview, getMeta
} = require('./db/index');
// Need to look into routing options
const router = express.Router();
module.exports = router;

// Controllers --> 5 needed as seen by API.

// GET
  router.get('/', (req, res) => {
    console.log('Works')
    getReview()
  })

  router.get('/meta', (req, res) => {
    getMeta()
  })
// POST

  // review
  router.post('/', (req, res) => {
    addReview(req.body)
    .then(() => {
      res.sendStatus(201)
    })
    .catch((err) => {
      res.sendStatus(500).send(err)
    })
  })

// PUT

// REPORT A REVIEW!
router.put('/:review_id/report', (req, res) => {
  putReport(req.params.review_id)
  .then (() => {
    res.sendStatus(204)
  })
  .catch((err) => {
    res.send(err).sendStatus(500)
  })
})

// INCREMENT HELPFUL!
router.put('/:review_id/helpful', (req, res) => {
  console.log(req.params.review_id)
  putHelpful(req.params.review_id)
  .then(() => {
    res.sendStatus(204)
  })
  .catch((err) => {
    res.send(err).sendStatus(500)
  })
})


// GET Requests
// app.get('/reviews', (req, res, next) => {
//   console.log(req.query.review_id);
//   db.query('SELECT * FROM reviews WHERE product_id = $1 AND reported = false', [req.query.product_id], (err, result) => {
//     if(err) {
//       return next(err);
//     }
//     res.send(result.rows); // Docs show result.rows[0]
//     return null;
//   })
// });


// app.get('/reviews_photos', (req, res, next) => {
//   console.log(req.query.review_id);
//   db.query('SELECT "url" FROM reviews_photos WHERE review_id = $1', [req.query.review_id], (err, result) => {
//     if(err) {
//       return next(err);
//     }
//     res.send(result.rows);
//     return null
//   })
// })

// app.get('') // How to get characteristics?

// // POST requests
// app.post('/', (req, res, next) => {
//   console.log(req.body)
//   db.query(
//     'INSERT INTO characteristics_reviews (characteristic_id, review_id, value) VALUES ($1, $2, $3)', [req.body.characteristic_id, req.body.review_id, req.body.value], (err, result) => {
//       if (err) {
//         console.log(err, 'NOOO')
//         return next(err);
//       }
//       res.status(201).send(result.rows);
//       return null;
//     })
// })

// app.post('/reviews', (req, res, next) => {
//   console.log(req.query.product_id);
//   db.query(`INSERT INTO reviews
//   (product_id, rating, "date", summary, body, recommend, reviewer_name, reviewer_email)
//   VALUES
//   ($1, $2, $3, $4, $5, $6, $7, $8)`,
//   [
//     req.query.product_id,
//     req.query.rating,
//     new Date().toISOString(),
//     req.query.summary,
//     req.query.body,
//     req.query.recommend,
//     req.query.name,
//     req.query.email
//   ],
//   (err, result) => {
//     if(err) {
//       return next(err);
//     }
//     res.status(200).send(result.rows); // Docs show result.rows[0]
//     return null;
//   })
// });

// // PUT requests




app.use(express.static(path.join(__dirname, '../dist')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const mountRoutes = require('./db/routes.js');

// mountRoutes(app);
