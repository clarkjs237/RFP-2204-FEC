-- in psql postgres --> \i /Users/deitchdustin/RFP-2204-FEC/server/dustinReviews/reviews.sql
--make sure out of reviews db

DROP DATABASE IF EXISTS reviews;

CREATE DATABASE reviews;

\connect reviews;

CREATE TABLE reviews(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id INTEGER,
  rating SMALLINT CHECK (rating > 0 AND rating <= 5),
  "date" BIGINT,
  summary VARCHAR(120),
  body VARCHAR(1000),
  recommend BOOLEAN,
  reported BOOLEAN DEFAULT false,
  reviewer_name VARCHAR(60),
  reviewer_email VARCHAR(60),
  response VARCHAR(1000),
  helpfulness INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE photos(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  review_id INTEGER NOT NULL,
  url TEXT
);

CREATE TABLE characteristics(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id INTEGER NOT NULL,
  name TEXT
);


CREATE TABLE characteristics_reviews(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value SMALLINT CHECK (vaLue > 0 AND value <= 5)
);

COPY reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/deitchdustin/RFP-2204-FEC/server/dustinReviews/reviews.csv' DELIMITER ',' CSV HEADER;

COPY photos (id, review_id, "url") FROM '/Users/deitchdustin/RFP-2204-FEC/server/dustinReviews/reviews_photos.csv' DELIMITER ',' CSV HEADER;

COPY characteristics_reviews (id, characteristic_id, review_id, "value") FROM '/Users/deitchdustin/RFP-2204-FEC/server/dustinReviews/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

COPY characteristics (id, product_id, "name") FROM '/Users/deitchdustin/RFP-2204-FEC/server/dustinReviews/characteristics.csv' DELIMITER ',' CSV HEADER;

ALTER TABLE reviews ALTER COLUMN date SET DATA TYPE timestamp with time zone USING timestamp with time zone 'epoch' + date * interval '1 millisecond';

ALTER TABLE reviews ALTER COLUMN date SET DEFAULT current_timestamp;

SELECT setval('reviews_id_seq', (SELECT max(id) FROM reviews));
SELECT setval('photos_id_seq', (SELECT max(id) FROM photos));
SELECT setval('characteristics_reviews_id_seq', (SELECT max(id) FROM characteristics_reviews));
SELECT setval('characteristics_id_seq', (SELECT max(id) FROM characteristics));

ALTER TABLE reviews
RENAME COLUMN id TO review_id;

CREATE INDEX review_product_id_index ON reviews (product_id);
CREATE INDEX characteristics_characteristic_id_index ON characteristics_reviews (characteristic_id);
CREATE INDEX characteristics_index ON characteristics (id);
CREATE INDEX photos_review_id ON photos (review_id);


