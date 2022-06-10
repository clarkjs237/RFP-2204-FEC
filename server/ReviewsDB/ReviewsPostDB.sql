DROP DATABASE IF EXISTS reviews;

CREATE DATABASE reviews;

\connect reviews;

CREATE TABLE reviews(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id NUMERIC NOT NULL,
  rating NUMERIC NOT NULL,
  date BIGINT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN DEFAULT false,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  response TEXT,
  helpfulness NUMERIC DEFAULT 0
);

CREATE TABLE reviews_images(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  review_id NUMERIC NOT NULL,
  url TEXT
);

CREATE TABLE characteristics_reviews(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  characteristics_id NUMERIC NOT NULL,
  review_id NUMERIC NOT NULL,
  value NUMERIC NOT NULL
);

CREATE TABLE characteristics(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id NUMERIC NOT NULL,
  name TEXT NOT NULL
);

COPY reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/deitchdustin/RFP-2204-FEC/server/ReviewsDB/reviews.csv' DELIMITER ',' CSV HEADER;
COPY reviews_images (id, review_id, "url") FROM '/Users/deitchdustin/RFP-2204-FEC/server/ReviewsDB/reviews_photos.csv' DELIMITER ',' CSV HEADER;
COPY characteristics_reviews (id, characteristics_id, review_id, "value") FROM '/Users/deitchdustin/RFP-2204-FEC/server/ReviewsDB/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;
COPY characteristics (id, product_id, "name") FROM '/Users/deitchdustin/RFP-2204-FEC/server/ReviewsDB/characteristics.csv' DELIMITER ',' CSV HEADER;

ALTER TABLE reviews ALTER COLUMN date SET DATA TYPE timestamp with time zone USING timestamp with time zone 'epoch' + date * interval '1 millisecond';

ALTER TABLE reviews ALTER COLUMN date SET DEFAULT current_timestamp;

SELECT setval('reviews_id_seq', (SELECT max(id) FROM reviews));
SELECT setval('reviews_images_id_seq', (SELECT max(id) FROM reviews_images));
SELECT setval('characteristics_reviews_id_seq', (SELECT max(id) FROM characteristics_reviews));
SELECT setval('characteristics_id_seq', (SELECT max(id) FROM characteristics));
