// This will be the router for each one of us

// require your route folder and add it to the function below

const reviews_sully = require('./reviews_sully/routes/reviews');

module.exports = app => {
  app.use('/reviews', reviews_sully);
  // ex: app.use('/questions', questions);
}