const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const navigationSchema = new Schema({
  title: { type: String, required: false, default: 'Заголовок не вказано' },
  value: { type: [Object], required: false },
});
module.exports = model('Navigation', navigationSchema);
