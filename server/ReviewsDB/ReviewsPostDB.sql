CREATE TABLE reviews(
    id SERIAL NOT NULL PRIMARY KEY,
    product_id INT NOT NULL UNIQUE,
    rating INT NOT NULL,
    review_date date BIGINT DEFAULT EXTRACT (EPOCH FROM CURRENT_TIMESTAMP),
    summary VARCHAR(60) NOT NULL,
    body VARCHAR(1000) NOT NULL,
    recommend BOOLEAN NOT NULL,
    reported BOOLEAN DEFAULT false,
    reviewer_name VARCHAR(60) NOT NULL,
    reviewer_email VARCHAR(60) NOT NULL UNIQUE,
    response TEXT,
    helpfulness NUMERIC DEFAULT 0
);

CREATE TABLE reviews_images(
  id SERIAL PRIMARY KEY,
  review_id INT REFERENCES reviews (id),
  "url" TEXT
);

CREATE TABLE characteristics_reviews(
  id SERIAL PRIMARY KEY,
  characteristics_id INT NOT NULL,
  review_id INT REFERENCES reviews (id),
  "value" INT NOT NULL
);

CREATE TABLE (
  
);

CREATE TABLE characteristics(
  id INT REFERENCES characteristics_reviews (id),
  product_id INT REFERENCES reviews (product_id),
  "name" VARCHAR(8) NOT NULL
);
