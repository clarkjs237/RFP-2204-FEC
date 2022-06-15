const express = require('express');
const path = require('path');
const {
  getProductData,
  getStyles,
  getRelated,
} = require('./prod_db/prods_controller');
const db = require('./prod_db/prod_sqldb');

const app = express();
// app.use(express.json());
// app.use(express.urlencoded());
const port = 8080;

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/products/:product_id', (req, res) => {
  const key = `JSON_OBJECT("id", id, "name", name, "slogan", slogan, "description", description, "category", category, "default_price", default_price, "features", (SELECT JSON_ARRAYAGG(JSON_OBJECT ("feature", feature, "value", value)) FROM features WHERE product_id = ${req.params.product_id}`;

  getProductData(req.params.product_id)
    .then((results) => res.send(results))
    .catch((err) => console.error(err));
});

app.get('/products/:product_id/styles', (req, res) => {
  getStyles(req.params.product_id)
    .then((results) => {
      res.send(results);
    })
    .catch((err) => console.log(err));
});

app.get('/products/:product_id/related', (req, res) => {
  const key = 'JSON_ARRAYAGG(related_product_id)';

  getRelated(req.params.product_id)
    .then((results) => res.send(results[0][0][key]))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
