const db = require('./prod_sqldb');

// -----------------------
// CRUD OPERATIONS
// -----------------------

module.exports = {
  // Get overview product
  getProductData: (req, res) => {
    let product = {};
    let features = [];

    // let params = [
    //   req.body.product.id
    // ];

    // get product object
    db.queryAsync(
      'SELECT JSON_OBJECT("id", id, "name", name, "slogan", slogan, "description", description, "category", category, "default_price", default_price) FROM product WHERE product.id = 1;'
    )
      .then((results) => {
        product = results;
      })
      // get features array
      .then(() =>
        db.queryAsync(
          'SELECT JSON_ARRAYAGG(JSON_OBJECT ("feature", feature, "value", value)) FROM features WHERE product_id = 1;'
        )
      )
      .then((results) => {
        features = results;
        product.features = features;
        res.status(200).json(product);
      })
      .cath((err) =>
        res.status(500).json('Something went wrong fetching this product...')
      );
  },

  getStyles: (req, res) => {
    const productStyles = {
      // update product id to be req.body.id
      product_id: '1',
    };

    // let params = [
    //   /* req.body.product.id */
    // ]

    db.queryAsync(
      'SELECT JSON_OBJECT("style_id", id, "name", name, "original_price", original_price, "sale_price", sale_price, "default_style", default_style) FROM styles WHERE styles.product_id = 1;'
    )
      .then((results) => {
        productStyles.results = results;
      })
      .then(() => {
        for (let i = 0; i < productStyles.results; i += 1) {
          db.queryAsync(
            `SELECT JSON_ARRAYAGG(JSON_OBJECT("thumbnail_url", thumbnail_url, "url", url)) FROM photos WHERE photos.style_id = ${productStyles.results[i].style_id};`
          ).then((results) => {
            const photos = results;
            productStyles.results[i].photos = photos;
          });
        }
      })
      .then(() => {
        for (let i = 0; i < productStyles.results; i += 1) {
          db.queryAsync(
            `SELECT JSON_ARRAYAGG(skus.id) FROM skus WHERE skus.style_id = ${productStyles.results[i].style_id};`
          ).then((results) => {
            results.forEach((skuID) => {
              db.queryAsync(
                `SELECT JSON_OBJECT("quantity", quantity, "size", size) FROM skus WHERE skus.style_id = ${productStyles.results[i].style_id};`
              )
                .then((skuInfo) => {
                  productStyles.results[i].styled_id.skus[skuID] = skuInfo;
                })
                .cath((err) =>
                  res
                    .status(500)
                    .json('Something went wrong fetching this product...')
                );
            });
          });
        }
      })
      .then(() => {
        res.status(200).json(productStyles);
      })
      .cath((err) =>
        res.status(500).json('Something went wrong fetching this product...')
      );
  },

  getRelated: (req, res) => {
    // productID = req.body

    db.queryAsync(
      `SELECT JSON_ARRAYAGG(related_product_id) FROM related WHERE current_product_id=${productID};`
    )
      .then((results) => {
        res.status(200).json(results);
      })
      .cath((err) =>
        res.status(500).json('Something went wrong fetching this product...')
      );
  },
};
