const mongoose = require('mongoose');

mongoose.connect('monogodb://localhost:27017/atelier');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  id: { type: Number, unique: true },
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number,
});

const featuresSchema = new Schema({
  id: { type: Number, unique: true },
  product_id: Number,
  feature: String,
  value: String,
});

const photosSchema = new Schema({
  id: { type: Number, unique: true },
  style_id: Number,
  url: String,
  thumbnail_url: String,
});

const relatedSchema = new Schema({
  id: { type: Number, unique: true },
  current_product_id: Number,
  related_product_id: Number,
});

const skusSchema = new Schema({
  id: { type: Number, unique: true },
  style_id: Number,
  size: String,
  quantity: Number,
});

const stylesSchema = new Schema({
  id: { type: Number, unique: true },
  product_id: Number,
  name: String,
  sale_price: Number,
  original_price: Number,
  default_style: Boolean,
});

module.exports.save = save;