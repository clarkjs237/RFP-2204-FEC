const pg = require('pg');

// Config for the database
// Will likely have to change the user, pw, host
// const config = {
//   user: 'sullyclark',
//   password: 'password',
//   database: 'reviews_db',
//   host: 'localhost',
//   port: 5432
// }

//
const config = {
  user: 'sullyclark',
  password: 'password',
  database: 'reviews_db',
  host: 'ec2-54-184-131-113.us-west-2.compute.amazonaws.com',
  port: 5432
}

// From node-postgres website:
// "If you're working on a web application or other software which makes frequent queries you'll want to use a connection pool."
// https://node-postgres.com/features/pooling

const pool = new pg.Pool(config);

// Async connect to the pool
async function connector() {
  // console.log(pool)
  await pool.connect();
}

// Connect to the pool
connector();
// const client = connector();

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
  await pool.query(query, queryArgs);
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

  await pool.query(query, queryArgs);
}


// Add a review to the db
exports.addReview = async function addReview(review) {
  // Review is the review object containing all this info, except for date
  // Create query and use values with dollar sign
  // Need to put quotes around date bc it is a reserved word

  // GONNA HAVE TO DO THE SAME THING IN PHOTOS
  // This creates a reviewObj with everything but photos and characteristics
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
    RETURNING review_id;`;

  // Get the current datetime in ISOString format, like we want
  // insert it to the array of object values
  const newDate = new Date().toISOString();
  const queryArgs = [
    reviewObj.product_id,
    reviewObj.rating,
    newDate,
    reviewObj.summary,
    reviewObj.body,
    reviewObj.recommend,
    reviewObj.name,
    reviewObj.email
  ];
  // Creat the query using the psql statement and the arguments
  const res = await pool.query(query, queryArgs);

  // Bc we are returning the id, we want to get the id to use for our photos table
  const review_id = res.rows[0].review_id;
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
    addToCharReviews(char_id, review_id, characteristics[char_id])
  })
}




//                  READ
// ---------------------------------------
// this is where the reviews meta and the product id specific page and count will come from
exports.readProduct = async function readProduct(product_id, page, count, sort) {
  // Figure out how to sort this list
  let sort_parameter;
  if (sort === 'relevant' || sort === 'relevance') {
    sort_parameter = '';
  } else if (sort === 'helpful' || sort === 'helpfulness') {
    sort_parameter = 'ORDER BY helpfulness DESC';
  } else {
    sort_parameter = 'ORDER BY date DESC';
  }

  // so page will be the offset value. This is determined by page * count.
  // count will be whatever the value passed in is
  // Will order by id as default unless sort is helpful or newest or relevant
  // Maybe relevant is the default and should just be id?
  const query = `
    SELECT review_id, rating, summary,
    recommend, response, body, "date",
    reviewer_name, helpfulness
    FROM reviews
    WHERE product_id = ${product_id} AND reported = FALSE
    ${sort_parameter}
    OFFSET ${page * count}
    LIMIT ${count}
  `;

  // This looks good for now. We need to also get photos and remove reviewer_email
  // and then reorganize things
  const res = await pool.query(query);
  const reviews_arr = res.rows;

  // I need to go through res.rows and get the photos that are associated with this
  // review_id for each one of these reviews

  // WOW
  // I needed to asynchronously get the photos based on review_id and map them
  // to an array. This is a really cool thing
  // For the journal, when I didn't use that await line before pool.query, the
  // array returned was full of undefined values. Which makes sense bc it wasn't
  // waiting for the async call to finish first
  // https://advancedweb.hu/how-to-use-async-functions-with-array-map-in-javascript/
  const photos_arr = await Promise.all(reviews_arr.map(async (review) => {
    const photo_query = `
      SELECT id,url FROM photos WHERE review_id = ${review.review_id}
    `;
    let photo_res = await pool.query(photo_query);
    photo_res = photo_res.rows;
    return photo_res;
  }))

  // Add the photos associated with each review
  reviews_arr.forEach((review, index) => {
    review.photos = photos_arr[index];
  })

  // CREATE THE OUTPUT OBJECT
  const output = {
    product: product_id.toString(),
    page: parseInt(page),
    count: parseInt(count),
    results: reviews_arr
  }

  return output;
}

// Create the ratings and recommended object for meta
async function ratingsAndRecommendedObjectCreator(product_id) {

  const query = `
    SELECT rating, recommend FROM reviews
    WHERE product_id = ${product_id} AND reported = FALSE
  `;

  const res = await pool.query(query);

  const ratingsObj = {"1": "0", "2": "0", "3": "0", "4": "0", "5":"0"};
  const recommendObj = {"false": "0", "true": "0"};
  res.rows.forEach((row) => {
    // Increase the count of each rating, and re-stringify it
    ratingsObj[row.rating] = (parseInt(ratingsObj[row.rating]) + 1).toString();
    recommendObj[row.recommend] = (parseInt(recommendObj[row.recommend]) + 1).toString();
  })

  return { ratingsObj, recommendObj };
}

async function characteristicObjectCreator(product_id) {
  // This compares the characteristic reviews against reviews to exclude reviews that
  // were reported and only returns the characteristic id and the value.
  // It also joins a third table, characteristics so that we know exactly which is which
  const query = `
    SELECT characteristic_reviews.characteristic_id, characteristic_reviews.value, characteristics.name
    FROM reviews
    INNER JOIN characteristic_reviews
    ON reviews.review_id = characteristic_reviews.review_id
    INNER JOIN characteristics
    ON characteristic_reviews.characteristic_id = characteristics.id
    WHERE reviews.product_id = ${product_id} and reported = FALSE ORDER BY 1;
  `;

  const res = await pool.query(query);

  const output = {};

  // I need to get the average of all of these numbers. This means I need to keep track of
  // the count for each one of these.
  // I think I'll make a total count and create a counter that will increment
  // then take the average and delete the counter property from the object
  res.rows.forEach((review) => {
    if (!output[review.name]) {
      // this isn't in the output yet, so create the object
      output[review.name] = {
        id: review.characteristic_id,
        value: review.value,
        count: 1
      }
    } else {
      // increase the value and the count
      output[review.name].value += review.value;
      output[review.name].count += 1;
    }
  })

  // Getting the average value and deleting count column
  Object.keys(output).forEach((name) => {
    output[name].value = (output[name].value / output[name].count).toString();
    delete output[name].count;
  })


  return output;
}

// Get the meta reviews for product id
exports.readProductMeta = async function readProductMeta(product_id){
  // Need the await keyword if I want that function to execute first
  const output = {
    product_id: product_id.toString(),
    ratings: {},
    recommended: {},
    characteristics: {}
  }

  const {ratingsObj, recommendObj} = await ratingsAndRecommendedObjectCreator(product_id);

  // Okay so now I need to figure out the characteristics
  // I need to use the product_id
  // I need to figure out how to exclude the reported reviews
  // I think this should be a join.


  const characteristicsObj = await characteristicObjectCreator(product_id);

  // Create the object that I want to send to pool.
  output.ratings = ratingsObj;
  output.recommended = recommendObj;
  output.characteristics = characteristicsObj;

  return output;
}



//                 UPDATE
// ---------------------------------------
// This is where we will mark reviews as helpful or reported based on what's entered
exports.markHelpful = async function markHelpful(review_id) {
  // will update the count of helpfulness by 1 based on review_id
  const query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = $1`;
  const queryArgs = [review_id];

  const res = await pool.query(query, queryArgs);
  return res;
}

exports.markReported = async function markReported(review_id) {
  // will change the reported column from false to true
  const query = `UPDATE reviews SET reported = TRUE WHERE review_id = $1`;
  const queryArgs = [review_id];

  const res = await pool.query(query, queryArgs);
  return res;
}


// Supposedly, the way I want to do this is to leave the connection open.
// Connecting and disconnecting from the pool each is unneccessary.
// https://stackoverflow.com/questions/50497583/when-to-disconnect-and-when-to-end-a-pg-pool-or-pool
// await pool.end();