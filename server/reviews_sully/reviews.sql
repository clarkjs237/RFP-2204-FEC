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
  characteristic_id INT NOT NULL,
  review_id INT NOT NULL,
  value INT NOT NULL
);

CREATE TABLE IF NOT EXISTS photos (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  review_id INT NOT NULL,
  url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  "date" TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN DEFAULT FALSE NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  response TEXT,
  helpfulness INT DEFAULT 0 NOT NULL -- I think I want the default here to be 0, for when a review is originally posted
);

CREATE TABLE IF NOT EXISTS characteristics (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id INT NOT NULL,
  name TEXT NOT NULL
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


-- Allowing for incrementing after copying

SELECT setval('characteristic_reviews_id_seq', (SELECT MAX(id) from "characteristic_reviews"));

SELECT setval('characteristics_id_seq', (SELECT MAX(id) from "characteristics"));

SELECT setval('reviews_id_seq', (SELECT MAX(id) from "reviews"));

SELECT setval('photos_id_seq', (SELECT MAX(id) from "photos"));


-- Alter column named id in reviews table to be reviews_id

ALTER TABLE reviews
RENAME COLUMN id TO review_id;