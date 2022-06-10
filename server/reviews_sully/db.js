const pg = require('pg');

// Config for the database
// Will likely have to change the user, pw, host
const config = {
  user: 'sullyclark',
  password: 'password',
  database: 'reviews_db',
  host: 'localhost',
  port: 5432
}

// Create a new pg.Client instance
const client = new pg.Client(config);

// Async connect to the client
async function connector() {
  await client.connect();
  // await client.end();
}

// Connect to the client
connector();

// ---------------------------------------
//          CRUD OPERATIONS
// ---------------------------------------

//                 CREATE
// ---------------------------------------
// Add a review to the db
exports.addReview = async function addReview(review) {
  // Review is the review object containing all this info, except for date
  // Create query and use values with dollar sign
  // Need to put quotes around date bc it is a reserved word
  const query = `
    INSERT INTO
    reviews (
      product_id,
      rating,
      "date",
      summary,
      body,
      recommend,
      reviewer_name,
      reviewer_email
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

  // Get the current datetime in ISOString format, like we want
  // insert it to the array of object values
  const newDate = new Date().toISOString();
  const queryArgs = Object.values(review);
  queryArgs.splice(2,0,newDate);

  // Creat the query using the psql statement and the arguments
  const res = await client.query(query, queryArgs);
  return res;
}


//                  READ
// ---------------------------------------
// this is where the reviews meta and the product id specific page and count will come from
exports.readProduct = async function readProduct(product_id, page, count) {
  console.log(product_id)
  console.log(page)
  console.log(count)
}



//                 UPDATE
// ---------------------------------------
// This is where we will mark reviews as helpful or reported based on what's entered
exports.markHelpful = async function markHelpful(review_id) {
  // will update the count of helpfulness by 1 based on review_id
  const query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1`;
  const queryArgs = [review_id];

  const res = await client.query(query, queryArgs);
  return res;
}

exports.markReported = async function markReported(review_id) {
  // will change the reported column from false to true
  const query = `UPDATE reviews SET reported = TRUE WHERE id = $1`;
  const queryArgs = [review_id];

  const res = await client.query(query, queryArgs);
  return res;
}



// await client.end();