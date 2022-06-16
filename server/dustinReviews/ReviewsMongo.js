const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/reviews');

const reviews = new mongoose.Schema ({
  product_id: {type: Number, unique: true},
  rating: Number,
  date: {type: Date, default: Date.now},
  summary: String,
  body: String,
  recommend: Boolean,
  reported: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  response: String,
  helpfullness: Number,
  photos: {
    id: Number,
    url: [String]
  },
  characteristics: {
    id: Number,
    value: Number
  }
})