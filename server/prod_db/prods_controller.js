const db = require('./prod_sqldb');

// -----------------------
// CRUD OPERATIONS
// -----------------------

module.exports = {
  // Get overview product
  getProductData: (productID) => {
    let product = {};
    let features = [];

    // get product object
    db.queryAsync(
      `SELECT JSON_OBJECT("id", id, "name", name, "slogan", slogan, "description", description, "category", category, "default_price", default_price) FROM product WHERE product.id = ${productID};`
    )
      .then((results) => {
        product = results;
      })
      // get features array
      .then(() =>
        db.queryAsync(
          `SELECT JSON_ARRAYAGG(JSON_OBJECT ("feature", feature, "value", value)) FROM features WHERE product_id = ${productID}`
        )
      )
      .then((results) => {
        features = results;
        product.features = features;
        return product;
      })
      .catch((err) => console.log(err));
  },

  getStyles: (productID) => {
    const productStyles = {
      product_id: productID,
    };

    db.queryAsync(
      `SELECT JSON_OBJECT("style_id", id, "name", name, "original_price", original_price, "sale_price", sale_price, "default_style", default_style) FROM styles WHERE styles.product_id = ${productID};`
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
                .cath((err) => console.log(err));
            });
          });
        }
      })
      .then(() => productStyles)
      .cath((err) => console.log(err));
  },

  getRelated: (productID) => {
    db.queryAsync(
      `SELECT JSON_ARRAYAGG(related_product_id) FROM related WHERE current_product_id= ${productID};`
    )
      .then((results) => results)
      .cath((err) => console.log(err));
  },
};
