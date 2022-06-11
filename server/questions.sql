CREATE DATABASE questions;

\connect questions;
CREATE TABLE questions (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id integer NOT NULL,
  body text NOT NULL,
  date_written bigint NOT NULL,
  asker_name text NOT NULL,
  asker_email text NOT NULL,
  reported boolean DEFAULT FALSE,
  helpful integer DEFAULT 0
);

CREATE TABLE answers (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  question_id integer NOT NULL REFERENCES questions,
  body text NOT NULL,
  date_written bigint NOT NULL,
  answerer_name text NOT NULL,
  answerer_email text NOT NULL,
  reported boolean DEFAULT FALSE,
  helpful integer DEFAULT 0
);

CREATE TABLE answers_photos (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  answer_id integer NOT NULL REFERENCES answers,
  url text NOT NULL
);

COPY questions (id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM
  '/Users/james/Source/rfp2204-sdc/server/questions.csv' DELIMITER ',' CSV HEADER;

COPY answers (id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
FROM
  '/Users/james/Source/rfp2204-sdc/server/answers.csv' DELIMITER ',' CSV HEADER;

COPY answers_photos (id, answer_id, url)
FROM
  '/Users/james/Source/rfp2204-sdc/server/answers_photos.csv' DELIMITER ',' CSV HEADER;

ALTER TABLE questions
  ALTER COLUMN date_written SET DATA TYPE timestamp WITH time zone USING timestamp WITH time zone 'epoch' + date_written * interval '1 millisecond';

ALTER TABLE answers
  ALTER COLUMN date_written SET DATA TYPE timestamp WITH time zone USING timestamp WITH time zone 'epoch' + date_written * interval '1 millisecond';

ALTER TABLE questions
  ALTER COLUMN date_written SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE answers
  ALTER COLUMN date_written SET DEFAULT CURRENT_TIMESTAMP;

SELECT
  setval('questions_id_seq', (
      SELECT
        max(id)
      FROM questions));

SELECT
  setval('answers_id_seq', (
      SELECT
        max(id)
      FROM answers));

SELECT
  setval('answers_photos_id_seq', (
      SELECT
        max(id)
      FROM answers_photos));
