require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const port = 8080;

app.get('/qa/questions', (req, res, next) => {
  db.query(
    `
    SELECT
    questions.product_id,
    questions.id AS question_id,
    questions.body AS question_body,
    questions.date_written AS question_date,
    questions.asker_name,
    questions.helpful AS question_helpfulness,
    questions.reported,
    answers.id,
    answers.body,
    answers.date_written AS date,
    answers.answerer_name,
    answers.helpful AS helpfulness
  FROM (
    SELECT
      *
    FROM
      questions
    WHERE
      product_id = $1
      AND reported = FALSE
    ORDER BY date_written DESC, id ASC
    LIMIT $2) questions
    LEFT JOIN (
      SELECT
        *
      FROM
        answers
      WHERE
        reported = FALSE) answers ON questions.id = answers.question_id
    `,
    [req.query.product_id, req.query.count],
    (err, result) => {
      if (err) {
        return next(err);
      }
      const questions = [];
      let previous = null;
      for (let i = 0; i < result.rows.length; i++) {
        const {
          question_id,
          question_body,
          question_date,
          asker_name,
          question_helpfulness,
          reported,
          id,
          body,
          date,
          answerer_name,
          helpfulness,
        } = result.rows[i];
        if (question_id !== previous) {
          questions.push({
            question_id,
            question_body,
            question_date,
            asker_name,
            question_helpfulness,
            reported,
            answers: {},
          });
        }
        previous = question_id;
        if(id) {
          questions[questions.length - 1].answers[id] = {
            id,
            body,
            date,
            answerer_name,
            helpfulness,
            photos: [],
          }
        }
      }
      res
        .status(200)
        .send({ product_id: req.query.product_id, results: questions });
      return null;
    }
  );
});

app.use(express.static(path.join(__dirname, '../dist')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
