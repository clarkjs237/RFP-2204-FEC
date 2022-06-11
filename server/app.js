require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const port = 8080;

app.get('/qa/questions', (req, res, next) => {
  db.query(
    'SELECT * FROM questions WHERE product_id = $1',
    [req.query.product_id],
    (err, result) => {
      if (err) {
        return next(err);
      }
      res.send(result.rows);
      return null;
    }
  );
});

app.use(express.static(path.join(__dirname, '../dist')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
