// const postgres = require('postgres');
// // import postgres from 'postgres';

// const sql = postgres('postgres://username:password@host:port/database', {
//   host: 'localhost',
//   username: '',
//   password: '',
//   port: 5432,
//   database: 'tester'
// });

// // async function createTable() {
// //   const t = await sql`
// //     create database if not exists toaster
// //   `;

// //   return t;
// // }

// // createTable();

// module.exports = sql;
// export default sql;



// const pool = new pg.Pool(config);

// async function createTable() {
//   const client = await pool.connect();

//   try {
//     await client.query('CREATE TABLE IF NOT EXISTS example_table');
//   } catch (error) {
//     console.error(error);
//   }

//   await pool.end();
// }

// createTable();

// module.exports = pool;



// This returns the correct data
// const { Client } = require('pg');

// const config = {
//   user: 'sullyclark',
//   password: 'password',
//   database: 'tester',
//   host: 'localhost',
//   port: 5432
// }

// const client = new Client(config);

// client.connect();

// client.query('SELECT * FROM t', (err, res) => {
//   if (!err) {
//     console.log(res.rows);
//   } else {
//     console.log(err);
//   }
//   client.end();
// })

const pg = require('pg');

// const config = {
//   user: 'sullyclark',
//   password: 'password',
//   database: 'tester',
//   host: 'localhost',
//   port: 5432
// }

const config = {
  user: 'sullyclark',
  password: 'password',
  database: 'reviews_db',
  host: 'localhost',
  port: 5432
}

const client = new pg.Client(config);


// async function characteristicsTableGenerator() {
//   await client.query(`
//     CREATE TABLE IF NOT EXISTS
//       characteristic_reviews
//       (id SERIAL PRIMARY KEY,
//         characteristic_id INT,
//         review_id INT,
//         value INT
//       )`
//   );
//   // await client.query(`
//   //   INSERT INTO
//   //     characteristics (characteristic)
//   //   VALUES
//   //     (Comfort)
//   // `);
// }

// function photosTableGenerator() {
//   client.query(`
//     CREATE TABLE IF NOT EXISTS
//       photos
//       (id SERIAL PRIMARY KEY,
//         review_id INT,
//         url VARCHAR
//       )`
//   );
// }

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
    (id SERIAL PRIMARY KEY,
      characteristic_id INT,
      review_id INT,
      value INT
    )`
  );

  // Photos table
  await client.query(`
  CREATE TABLE IF NOT EXISTS
    photos
    (id SERIAL PRIMARY KEY,
      review_id INT,
      url TEXT
    )`
  );

  // Reviews table
  await client.query(`
  CREATE TABLE IF NOT EXISTS
    reviews
    (id SERIAL PRIMARY KEY,
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
    (id SERIAL PRIMARY KEY,
      product_id INT,
      name TEXT
    )`
  );


  // // Ratings table
  // await client.query(`
  // CREATE TABLE
  //   ratings
  //   (id SERIAL PRIMARY KEY,
  //     product_id INT,
  //     one_star INT,
  //     two_star INT,
  //     three_star INT,
  //     four_star INT,
  //     five_star INT
  //   )`
  // );


  // characteristicsTableGenerator();
  // await photosTableGenerator();
  // await client.query("SELECT 'CREATE DATABASE example_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mydb')"\gexec);
  await client.end();
}


databaseCreator();

module.exports =  client;