const db = require('./prod_sqldb');

// -----------------------
// CRUD OPERATIONS
// -----------------------

module.exports = {
  // Get overview product
  getProductData: (productID) =>
    db
      .queryAsync(
        `SELECT JSON_OBJECT("id", id, "name", name, "slogan", slogan, "description", description, "category", category, "default_price", default_price, "features", (SELECT JSON_ARRAYAGG(JSON_OBJECT ("feature", feature, "value", value)) FROM features WHERE product_id = ${productID})) FROM product WHERE product.id = ${productID};`
      )
      .then((results) => results[0][0][Object.keys(results[0][0])[0]])
      .catch((err) => console.log(err)),

  getStyles: (productID) =>
    db
      .queryAsync(
        `SELECT JSON_ARRAYAGG(JSON_OBJECT("style_id", id, "name", name, "original_price", original_price, "sale_price", sale_price, "default_style", default_style, "photos", (SELECT JSON_ARRAYAGG(JSON_OBJECT("thumbnail_url", thumbnail_url, "url", url)) FROM photos WHERE photos.style_id = styles.id), "skus", (SELECT JSON_OBJECTAGG(skus.id, (SELECT JSON_OBJECT("quantity", quantity, "size", size) FROM skus WHERE skus.id = skus.style_id)) FROM skus WHERE skus.style_id =styles.id))) FROM styles WHERE styles.product_id = ${productID};`
      )
      .then((results) => ({
        product_id: productID,
        results: results[0][0][Object.keys(results[0][0])[0]],
      }))
      .catch((err) => console.log(err)),

  getRelated: (productID) =>
    db
      .queryAsync(
        `SELECT JSON_ARRAYAGG(related_product_id) FROM related WHERE related.current_product_id= ${productID};`
      )
      .then((results) => results)
      .catch((err) => console.log(err)),
};
