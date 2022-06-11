CREATE DATABASE questions;

\connect questions;

CREATE TABLE questions (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  asker_name TEXT NOT NULL,
  asker_email TEXT NOT NULL,
  reported BOOLEAN DEFAULT false,
  helpful INTEGER DEFAULT 0
);

CREATE TABLE answers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  question_id INTEGER NOT NULL REFERENCES questions,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name TEXT NOT NULL,
  answerer_email TEXT NOT NULL,
  reported BOOLEAN DEFAULT false,
  helpful INTEGER DEFAULT 0
);

CREATE TABLE answers_photos (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  answer_id INTEGER NOT NULL REFERENCES answers,
  url TEXT NOT NULL
);

COPY questions (id, product_id, body, date_written, asker_name, asker_email, reported, helpful) FROM '/Users/james/Source/rfp2204-sdc/server/questions.csv' DELIMITER ',' CSV HEADER;
COPY answers (id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) FROM '/Users/james/Source/rfp2204-sdc/server/answers.csv' DELIMITER ',' CSV HEADER;
COPY answers_photos (id, answer_id, url) FROM '/Users/james/Source/rfp2204-sdc/server/answers_photos.csv' DELIMITER ',' CSV HEADER;

ALTER TABLE questions ALTER COLUMN date_written SET DATA TYPE timestamp with time zone USING timestamp with time zone 'epoch' + date_written * interval '1 millisecond';
ALTER TABLE answers ALTER COLUMN date_written SET DATA TYPE timestamp with time zone USING timestamp with time zone 'epoch' + date_written * interval '1 millisecond';

ALTER TABLE questions ALTER COLUMN date_written SET DEFAULT current_timestamp;
ALTER TABLE answers ALTER COLUMN date_written SET DEFAULT current_timestamp;

SELECT setval('questions_id_seq', (SELECT max(id) FROM questions));
SELECT setval('answers_id_seq', (SELECT max(id) FROM answers));
SELECT setval('answers_photos_id_seq', (SELECT max(id) FROM answers_photos));
