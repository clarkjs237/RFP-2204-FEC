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

  // So we are looping through the keys in characteristics, which are the
  // characteristic_ids. Then we want to post to the characteristic_reviews table
  // with the characteristic_id, review_id, and value associated. All good!
  Object.keys(characteristics).forEach((char_id) => {
    // console.log(char_id)
    // console.log(characteristics[char_id])
    addToCharReviews(char_id, review_id, characteristics[char_id])
  })

  // I think this is good for now. Eventually, I think I'll need to reference the id and product_id to get the name
  // of the characteristic for reviews/meta but this is a good start
}




//                  READ
// ---------------------------------------
// this is where the reviews meta and the product id specific page and count will come from
exports.readProduct = async function readProduct(product_id, page, count, sort) {
  // Figure out how to sort this list
  let sort_parameter;
  if (sort === 'relevant') {
    sort_parameter = '';
  } else if (sort === 'helpful') {
    sort_parameter = 'ORDER BY helpfulness DESC';
  } else {
    sort_parameter = 'ORDER BY date DESC';
  }

  // so page will be the offset value. This is determined by page * count.
  // count will be whatever the value passed in is
  // Will order by id as default unless sort is helpful or newest or relevant
  // Maybe relevant is the default and should just be id?
  const query = `
    SELECT review_id, rating, summary, recommend, response, body, "date", reviewer_name, helpfulness FROM reviews
    WHERE product_id = ${product_id} AND reported = FALSE
    ${sort_parameter}
    OFFSET ${page * count}
    LIMIT ${count}
  `;

  // This looks good for now. We need to also get photos and remove reviewer_email
  // and then reorganize things
  const res = await client.query(query);
  const reviews_arr = res.rows;

  // I need to go through res.rows and get the photos that are associated with this
  // review_id for each one of these reviews

  // WOW
  // I needed to asynchronously get the photos based on review_id and map them
  // to an array. This is a really cool thing
  // For the journal, when I didn't use that await line before client.query, the
  // array returned was full of undefined values. Which makes sense bc it wasn't
  // waiting for the async call to finish first
  // https://advancedweb.hu/how-to-use-async-functions-with-array-map-in-javascript/
  const photos_arr = await Promise.all(reviews_arr.map(async (review) => {
    const photo_query = `
      SELECT id,url FROM photos WHERE review_id = ${review.id}
    `;
    let photo_res = await client.query(photo_query);
    photo_res = photo_res.rows;
    return photo_res;
  }))

  // console.log(photo_arr);
  // Need to assign it to variable bc destructing doesn't like res.rows

  // const reviews_arr = res.rows;

  reviews_arr.forEach((review, index) => {
    // review.photos = 'THIS IS PHOTOS'
    review.photos = photos_arr[index];
  })

  return reviews_arr;
}

// Get the meta reviews for product id
exports.readProductMeta = async function readProductMeta(){
  console.log('hello');
}



//                 UPDATE
// ---------------------------------------
// This is where we will mark reviews as helpful or reported based on what's entered
exports.markHelpful = async function markHelpful(review_id) {
  // will update the count of helpfulness by 1 based on review_id
  const query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = $1`;
  const queryArgs = [review_id];

  const res = await client.query(query, queryArgs);
  return res;
}

exports.markReported = async function markReported(review_id) {
  // will change the reported column from false to true
  const query = `UPDATE reviews SET reported = TRUE WHERE review_id = $1`;
  const queryArgs = [review_id];

  const res = await client.query(query, queryArgs);
  return res;
}



// await client.end();