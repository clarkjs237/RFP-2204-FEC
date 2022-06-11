const db = require('./prod_sqldb');

// -----------------------
// CRUD OPERATIONS
// -----------------------

module.exports = {
  // Get overview product
  getProductData: (req, res) => {
    let product = {};

    let params = [
      /*req.body.product.id */
    ];

    db.queryAsync(
      'SELECT JSON_OBJECT('id', id, 'name', name, 'slogan', slogan, 'description',description, 'category', category, 'default_price', default_price) FROM product WHERE product.id = 1;',
      params
    )
    .then((results) =>
      product = results;
    )
    .then(() =>
      db.queryAsync(
        'SELECT JSON_OBJECT (feature, value) FROM features WHERE product_id = 1;'
      )
    );


  },
};
