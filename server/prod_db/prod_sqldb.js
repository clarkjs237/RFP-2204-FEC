// require("dotenv").config();
const mysql = require('mysql2');
const Promise = require('bluebird');

// const DB_HOST = process.env.DB_HOST
const DB_NAME = 'products';
// const DB_PASS = process.env.DB_PASS
// const DB_USER = process.env.DB_USER

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
});

const db = Promise.promisifyAll(connection, { multiArgs: true });

db.connectAsync()
  .then(() => console.log(`Connected to MySQL as id: ${db.threadId}`))
  .then(() => db.queryAsync(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`)) // update `products` to ${DB_NAME};
  .then(() => db.queryAsync(`USE ${DB_NAME}`)) // update `products` to ${DB_NAME};
  .then(() =>
    db.queryAsync(
      `CREATE TABLE IF NOT EXISTS product (
        id INT UNIQUE,
        name VARCHAR(100) NULL DEFAULT NULL,
        slogan VARCHAR(100) NULL DEFAULT NULL,
        description VARCHAR(500),
        category VARCHAR(100) NULL DEFAULT NULL,
        default_price DECIMAL(9, 2) NULL DEFAULT NULL,
        PRIMARY KEY (id)
      );`
    )
  )
  .then(() =>
    db.queryAsync(
      `CREATE TABLE IF NOT EXISTS related (
        id INT UNIQUE,
        current_product_id INT NULL DEFAULT NULL,
        related_product_id INT NULL DEFAULT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (current_product_id) REFERENCES product (id),
        FOREIGN KEY (related_product_id) REFERENCES product (id)
      );`
    )
  )
  .then(() =>
    db.queryAsync(
      `CREATE TABLE IF NOT EXISTS styles (
        id INT UNIQUE,
        product_id INT NULL DEFAULT NULL,
        name VARCHAR(100) NULL DEFAULT NULL,
        sale_price DECIMAL(6, 2) NULL DEFAULT NULL,
        original_price DECIMAL(11, 2) NULL DEFAULT NULL,
        default_style BOOLEAN,
        PRIMARY KEY (id),
        FOREIGN KEY (product_id) REFERENCES product (id)
      );`
    )
  )
  .then(() =>
    db.queryAsync(
      `CREATE TABLE IF NOT EXISTS features (
        id INT UNIQUE,
        product_id INT NULL DEFAULT NULL,
        feature VARCHAR(200) NULL DEFAULT NULL,
        value VARCHAR(200) NULL DEFAULT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (product_id) REFERENCES product (id)
      );`
    )
  )
  .then(() =>
    db.queryAsync(
      `CREATE TABLE IF NOT EXISTS photos (
        id INT UNIQUE,
        style_id INT NULL DEFAULT NULL,
        thumbnail_url VARCHAR(400) NULL DEFAULT NULL,
        url VARCHAR(400) NULL DEFAULT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (style_id) REFERENCES styles (id)
      );`
    )
  )
  .then(() =>
    db.queryAsync(
      `CREATE TABLE IF NOT EXISTS skus (
        id INT UNIQUE,
        style_id INT NULL DEFAULT NULL,
        size VARCHAR(10) NULL DEFAULT NULL,
        quantity INT NULL DEFAULT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (style_id) REFERENCES styles (id)
      );`
    )
  )
  .catch((err) => console.log(err));

module.exports = db;
