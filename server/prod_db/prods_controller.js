const db = require('./prod_sqldb');

// -----------------------
// CRUD OPERATIONS
// -----------------------

module.exports = {
  // Get overview product
  getProductData: (req, res) => {
    let product = {};
    let features = [];

    let params = [
      /*req.body.product.id */
    ];

    db.queryAsync(
      'SELECT JSON_OBJECT('id', id, 'name', name, 'slogan', slogan, 'description',description, 'category', category, 'default_price', default_price) FROM product WHERE product.id = 1;'
    )
    .then((results) =>
      product = results;
    )
    .then(() =>
      db.queryAsync(
        'SELECT JSON_ARRAYAGG(JSON_OBJECT ('feature', feature, 'value', value)) FROM features WHERE product_id = 1;'
      )
    )
    .then((results) =>
      let features = results;
      product.features = features;
    )
    .then((response) =>
      res.status(200).json(response)
    );
    .cath((err) =>
      res.status(500).json('Something went wrong fetching this product...')
    )
  },
};
