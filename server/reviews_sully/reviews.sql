-- Run this upon server start once and don't run it again
-- \i /Users/sullyclark/Desktop/HackReactor/SDC/RFP-2204-FEC/server/reviews_sully/reviews.sql

-- Drop db if exists and create reviews_dbs

DROP DATABASE IF EXISTS reviews_db;

CREATE DATABASE reviews_db;

-- Connect to db

\connect reviews_db;


-- Create the tables

CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  characteristic_id INT,
  review_id INT,
  value INT
);

CREATE TABLE IF NOT EXISTS photos (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  review_id INT,
  url TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
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
);

CREATE TABLE IF NOT EXISTS characteristics (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id INT,
  name TEXT
);

-- Copying the data from the csv files to the tables

COPY characteristic_reviews
FROM '/Users/sullyclark/Desktop/HackReactor/SDC/PythonCSVProcessing/characteristic_reviews.csv'
DELIMITER ','
CSV Header;

COPY characteristics
FROM '/Users/sullyclark/Desktop/HackReactor/SDC/PythonCSVProcessing/characteristics.csv'
DELIMITER ','
CSV Header;

COPY photos
FROM '/Users/sullyclark/Desktop/HackReactor/SDC/PythonCSVProcessing/reviews_photos.csv'
DELIMITER ','
CSV Header;

COPY reviews
FROM '/Users/sullyclark/Desktop/HackReactor/SDC/PythonCSVProcessing/reviews_transformed.csv'
DELIMITER ','
CSV Header;


-- Allowing for incrementing upon inserting

SELECT setval('characteristic_reviews_id_seq', (SELECT MAX(id) from "characteristic_reviews"));

SELECT setval('characteristics_id_seq', (SELECT MAX(id) from "characteristics"));

SELECT setval('reviews_id_seq', (SELECT MAX(id) from "reviews"));

SELECT setval('photos_id_seq', (SELECT MAX(id) from "photos"));