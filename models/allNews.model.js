const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const allNewsSchema = new Schema({
  title: { type: String, required: false, default: 'Заголовок не вказаний' },
  description: { type: String, required: false },
  tags: { type: [String], required: false },
  year: { type: Number },
  month: { type: Number },
  image: { type: String, required: false },
  date: { type: String, required: false },
  link: { type: String, required: true },
});
module.exports = model('AllNews', allNewsSchema);
