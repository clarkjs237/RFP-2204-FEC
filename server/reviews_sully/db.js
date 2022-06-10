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

connector();

// This is where I could come up with my CRUD operations and export them as so
exports.testerBoy = async function testerBoy() {
  const res = await client.query('SELECT * from photos LIMIT 10');
  return res;
}

exports.bananaBoat = async function bananaBoat() {
  const res = await client.query('SELECT * FROM photos ORDER BY id DESC LIMIT 10');
  return res;
}


// On the put request, we are missing:
// date, reported, response, helpfulness - we can omit helpfulness bc default is 0
// we cam omit response and reported as well
// So all we need is to get date in that iso format for utc

// We need:

// product_id
// rating
// date    --- NEED TO CREATE THIS MYSELF
// summary
// body
// recommend
// reviewer_name
// reviewer_email

exports.addReview = async function addReview(review) {
  // review is supposedly going to be the review that we need
  // console.log('THIS IS REVIEW');
  // console.log(review);
  // console.log(Object.values(review))
  // console.log(new Date().getTime());

  // Create query and use values witj dollar sign
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

// Export the client
// module.exports =  client;









// Not gonna use this but was kind of interesting to do

// async function databaseCreator() {
//   await client.connect();
//   // await client.query('DROP DATABASE reviews_db');
//   // await client.query('CREATE DATABASE reviews_db');
//   // await client.connect();
//   // await client.query('\c reviews_db');

//   // Characteristic Reviews table
//   await client.query(`
//   CREATE TABLE IF NOT EXISTS
//     characteristic_reviews
//     (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//       characteristic_id INT,
//       review_id INT,
//       value INT
//     )`
//   );

//   // Photos table
//   await client.query(`
//   CREATE TABLE IF NOT EXISTS
//     photos
//     (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//       review_id INT,
//       url TEXT
//     )`
//   );

//   // Reviews table
//   await client.query(`
//   CREATE TABLE IF NOT EXISTS
//     reviews
//     (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//       product_id INT,
//       rating INT,
//       date TEXT,
//       summary TEXT,
//       body TEXT,
//       recommend BOOLEAN,
//       reported BOOLEAN,
//       reviewer_name TEXT,
//       reviewer_email TEXT,
//       response TEXT,
//       helpfulness INT
//     )`
//   );

//   // Characteristics table
//   await client.query(`
//   CREATE TABLE IF NOT EXISTS
//     characteristics
//     (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//       product_id INT,
//       name TEXT
//     )`
//   );



//   // Actually loading the db now using COPY
//   await client.query(`
//     COPY characteristic_reviews
//     FROM '/Users/sullyclark/Desktop/HackReactor/SDC/PythonCSVProcessing/characteristic_reviews.csv'
//     DELIMITER ','
//     CSV Header;
//   `);
//   await client.query(`
//     COPY characteristics
//     FROM '/Users/sullyclark/Desktop/HackReactor/SDC/PythonCSVProcessing/characteristics.csv'
//     DELIMITER ','
//     CSV Header;
//   `);
//   await client.query(`
//     COPY photos
//     FROM '/Users/sullyclark/Desktop/HackReactor/SDC/PythonCSVProcessing/reviews_photos.csv'
//     DELIMITER ','
//     CSV Header;
//   `);
//   await client.query(`
//     COPY reviews
//     FROM '/Users/sullyclark/Desktop/HackReactor/SDC/PythonCSVProcessing/reviews_transformed.csv'
//     DELIMITER ','
//     CSV Header;
//   `);


//   // Adjust the setval so the max is
//   await client.query(`
//   SELECT setval('characteristic_reviews_id_seq', (SELECT MAX(id) from "characteristic_reviews"));
//   `)
//   await client.query(`
//   SELECT setval('characteristics_id_seq', (SELECT MAX(id) from "characteristics"));
//   `)
//   await client.query(`
//   SELECT setval('reviews_id_seq', (SELECT MAX(id) from "reviews"));
//   `)
//   await client.query(`
//   SELECT setval('photos_id_seq', (SELECT MAX(id) from "photos"));
//   `)




//   await client.end();
// }