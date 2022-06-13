// This is going to handle the routing for all of the routes
const reviews = require('./reviews');

module.exports = app => {
  app.use('/reviews', reviews);
}

