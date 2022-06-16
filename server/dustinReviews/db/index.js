/* eslint-disable radix */
/* eslint-disable camelcase */
const pg = require('pg');

const config = {
  user: 'deitchdustin',
  database: 'reviews',
  password: null,
  host: 'localhost',
  port: 5432
}

const pool = new pg.Pool(config);

async function connector() {
  await pool.connect();
}

connector();

// GET //

// Get review based on product Id
// ex:http://localhost:8080/reviews?product_id=1
exports.getReview = async function getReview(product_id, page, count, sort) {
  // Start with relevance first -- handle in reviews.js controllers
  let sort_parameter;
  if (sort === 'relevant' || sort === 'relevance') {
    sort_parameter = '';
  } else if (sort === 'helpful' || sort === 'helpfulness') {
    sort_parameter = 'ORDER BY helpfulness DESC';
  } else {
    sort_parameter = 'ORDER BY date DESC';
  }

  const query = `
    SELECT review_id, rating, summary,
    recommend, response, body, "date",
    reviewer_name, helpfulness FROM reviews
    WHERE product_id = ${product_id} AND reported = FALSE
    ${sort_parameter}
    OFFSET ${page * count}
    LIMIT ${count}
  `;

  const res = await pool.query(query);
  const reviewArr = res.rows;

  const photosArr = await Promise.all(reviewArr.map(async (review) => {
    const queryPhoto = ` SELECT id,url FROM photos WHERE review_id = ${review.review_id} `;
    let photoRes = await pool.query(queryPhoto);
    photoRes = photoRes.rows;
    return photoRes;
  }))

  reviewArr.forEach((review, index) => {
    review.photos = photosArr[index];
  })

  const sentObj = {
    product: product_id.toString(),
    page: parseInt(page),
    count: parseInt(count),
    results: reviewArr
  }

  return sentObj;
}

// used within meta get
async function metaObj(product_id) {

  const query = `
    SELECT rating, recommend FROM reviews
    WHERE product_id = ${product_id} AND reported = FALSE
  `;

  const res = await pool.query(query);

  const ratingsObj = {"1": "0", "2": "0", "3": "0", "4": "0", "5":"0"};
  const recommendObj = {"false": "0", "true": "0"};
  res.rows.forEach((row) => {
    ratingsObj[row.rating] = (parseInt(ratingsObj[row.rating]) + 1).toString();
    recommendObj[row.recommend] = (parseInt(recommendObj[row.recommend]) + 1).toString();
  })

  return { ratingsObj, recommendObj };
}

async function characteristicObj(product_id) {

  const query = `
    SELECT characteristics_reviews.characteristic_id, characteristics_reviews.value, characteristics.name
    FROM reviews INNER JOIN characteristics_reviews ON reviews.review_id = characteristics_reviews.review_id
    INNER JOIN characteristics ON characteristics_reviews.characteristic_id = characteristics.id
    WHERE reviews.product_id = ${product_id} and reported = FALSE ORDER BY 1;
  `;

  const res = await pool.query(query);

  const sentObj = {};

  res.rows.forEach((review) => {
    if (!sentObj[review.name]) {
      sentObj[review.name] = {
        id: review.characteristic_id,
        value: review.value,
        count: 1
      }
    } else {

      sentObj[review.name].value += review.value;
      sentObj[review.name].count += 1;
    }
  })

  Object.keys(sentObj).forEach((name) => {
    sentObj[name].value = (sentObj[name].value / sentObj[name].count).toString();
    delete sentObj[name].count;
  })

  return sentObj;
}

// Get the meta reviews for product id
// ex: http://localhost:8080/reviews/meta?product_id=1
exports.getMeta = async function getMeta(product_id){
  const sentObj = { product_id: product_id.toString(), ratings: {}, recommended: {}, characteristics: {} }
  const {ratingsObj, recommendObj} = await metaObj(product_id);
  const characteristicsObj = await characteristicObj(product_id);

  sentObj.ratings = ratingsObj;
  sentObj.recommended = recommendObj;
  sentObj.characteristics = characteristicsObj;

  return sentObj;
}


// POSTS //

// Post Characteristic
// used within meta
async function charReviewAdd(char_id, review_id, value) {

  const query = `
    INSERT INTO characteristics_reviews ( characteristic_id, review_id, value )
    VALUES ($1, $2, $3)`;

  const args = [parseInt(char_id), review_id, value];
  await pool.query(query, args);
}


// Post Photos
// used in review post
async function photosAdd(review_id, url) {
  const query = ` INSERT INTO photos ( review_id, url ) VALUES ($1, $2)`;
  const args = [review_id, url];
  await pool.query(query, args);
}


// Post Review
// http://localhost:8080/reviews/?product_id=1
exports.addReview = async function addReview(review) {
  const {photos, characteristics, ...reviewObj} = review;

  const query = `
    INSERT INTO
    reviews ( product_id, rating, "date", summary, body, recommend, reviewer_name, reviewer_email )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING review_id;`;

  const newDate = new Date().toISOString();
  const args = [
    reviewObj.product_id,
    reviewObj.rating,
    newDate,
    reviewObj.summary,
    reviewObj.body,
    reviewObj.recommend,
    reviewObj.name,
    reviewObj.email
  ];
  const res = await pool.query(query, args);
  const review_id = res.rows[0].review_id;

  photos.forEach((url) => photosAdd(review_id, url));
  Object.keys(characteristics).forEach((char_id) => {
    charReviewAdd(char_id, review_id, characteristics[char_id])
  })
}


// PUT //

// Put for helpful increment
// ex:http://localhost:8080/reviews/5/helpful
exports.putHelpful = async function putHelpful(review_id) {
  const query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = $1`;
  const res = await pool.query(query, [review_id]);
  return res;
}

// Put for reported to true
// ex:http://localhost:8080/reviews/5/report
exports.putReported = async function putReported(review_id) {
  const query = `UPDATE reviews SET reported = true WHERE review_id = $1`;
  const res = await pool.query(query, [review_id]);
  return res;
}