const dustinReviews = require('./dustinReviews/routes/reviews');

module.exports = app => {
  app.use('/reviews', dustinReviews);
}