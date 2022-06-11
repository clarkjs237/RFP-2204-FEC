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

// Add posts to the photos table
async function addToPhotos(review_id, url) {
  // I will be given a review_id and a url and will post it into the photos table
  const query = `
    INSERT INTO
    photos (
      review_id,
      url
    )
    VALUES ($1, $2)`;

  const queryArgs = [review_id, url];
  await client.query(query, queryArgs);
}

// Adds to the characteristic_reviews table
async function addToCharReviews(char_id, review_id, value) {
  // char_id needs to be converted from a string into an integer
  // review_id is an int
  // value is an int
  const query = `
    INSERT INTO
    characteristic_reviews (
      characteristic_id,
      review_id,
      value
    )
    VALUES ($1, $2, $3)`;

  const queryArgs = [parseInt(char_id), review_id, value];

  await client.query(query, queryArgs);
}


// Add a review to the db
exports.addReview = async function addReview(review) {
  // Review is the review object containing all this info, except for date
  // Create query and use values with dollar sign
  // Need to put quotes around date bc it is a reserved word

  // GONNA HAVE TO DO THE SAME THING IN PHOTOS
  // This creates a reviewObj with everything but photos
  // and create a variable photos with the value associated
  const {photos, characteristics, ...reviewObj} = review;


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
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id;`;

  // Get the current datetime in ISOString format, like we want
  // insert it to the array of object values
  const newDate = new Date().toISOString();
  const queryArgs = [reviewObj.product_id, reviewObj.rating, newDate, reviewObj.summary, reviewObj.body, reviewObj.recommend, reviewObj.name, reviewObj.email];
  // Creat the query using the psql statement and the arguments
  const res = await client.query(query, queryArgs);

  // Bc we are returning the id, we want to get the id to use for our photos table
  const review_id = res.rows[0].id;
  // I also want to add to the photos table, characteristics table and char_reviews as well
  // Loop through the photos and add each to the photos table
  photos.forEach((url) => addToPhotos(review_id, url));

  // So i want to post to characteristic_reviews first, return
  // This one is proving to be pretty tricky so I may have to leave it for now
  // I think I get that I could join these two but then where do I get name from
  // BOTTOM LINE, IM NOT GOING TO ADD TO CHARACTERISTICS. ONLY CHARACTERISTIC_REVIEWS
  // this is bc we're not adding any new products

  // I'm going to receive:
  // characteristic_id which is a string version of a number. This corresponds to ID IN CHARACTERISTICS
  // value. This will be entered into characteristic_reviews
  Object.keys(characteristics).forEach((char_id) => {
    console.log(char_id)
    console.log(characteristics[char_id])
    addToCharReviews(char_id, review_id, characteristics[char_id])
  })

  // I think this is good for now. Eventually, I think I'll need to reference the id and product_id to get the name
  // of the characteristic for reviews/meta but this is a good start
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