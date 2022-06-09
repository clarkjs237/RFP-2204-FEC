const pg = require('pg');

const config = {
  user: 'sullyclark',
  password: 'password',
  database: 'reviews_db',
  host: 'localhost',
  port: 5432
}

const client = new pg.Client(config);


async function databaseCreator() {
  await client.connect();
  // await client.query('DROP DATABASE reviews_db');
  // await client.query('CREATE DATABASE reviews_db');
  // await client.connect();
  // await client.query('\c reviews_db');

  // Characteristic Reviews table
  await client.query(`
  CREATE TABLE IF NOT EXISTS
    characteristic_reviews
    (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      characteristic_id INT,
      review_id INT,
      value INT
    )`
  );

  // Photos table
  await client.query(`
  CREATE TABLE IF NOT EXISTS
    photos
    (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      review_id INT,
      url TEXT
    )`
  );

  // Reviews table
  await client.query(`
  CREATE TABLE IF NOT EXISTS
    reviews
    (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      product_id INT,
      rating INT,
      date TEXT,
      summary TEXT,
      body TEXT,
      recommend BOOLEAN,
      reported BOOLEAN,
      reviewer_name TEXT,
      reviewer_email TEXT,
      response TEXT,
      helpfulness INT
    )`
  );

  // Characteristics table
  await client.query(`
  CREATE TABLE IF NOT EXISTS
    characteristics
    (id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      product_id INT,
      name TEXT
    )`
  );



  // Actually loading the db now using COPY
  await client.query(`
    COPY characteristic_reviews
    FROM '/Users/sullyclark/Desktop/HackReactor/SDC/PythonCSVProcessing/characteristic_reviews.csv'
    DELIMITER ','
    CSV Header;
  `);
  await client.query(`
    COPY characteristics
    FROM '/Users/sullyclark/Desktop/HackReactor/SDC/PythonCSVProcessing/characteristics.csv'
    DELIMITER ','
    CSV Header;
  `);
  await client.query(`
    COPY photos
    FROM '/Users/sullyclark/Desktop/HackReactor/SDC/PythonCSVProcessing/reviews_photos.csv'
    DELIMITER ','
    CSV Header;
  `);
  await client.query(`
    COPY reviews
    FROM '/Users/sullyclark/Desktop/HackReactor/SDC/PythonCSVProcessing/reviews_transformed.csv'
    DELIMITER ','
    CSV Header;
  `);


  // Adjust the setval so the max is
  await client.query(`
  SELECT setval('characteristic_reviews_id_seq', (SELECT MAX(id) from "characteristic_reviews"));
  `)
  await client.query(`
  SELECT setval('characteristics_id_seq', (SELECT MAX(id) from "characteristics"));
  `)
  await client.query(`
  SELECT setval('reviews_id_seq', (SELECT MAX(id) from "reviews"));
  `)
  await client.query(`
  SELECT setval('photos_id_seq', (SELECT MAX(id) from "photos"));
  `)




  await client.end();
}


databaseCreator();

module.exports =  client;