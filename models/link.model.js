const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const linkSchema = new Schema({
  url: { type: String, required: true, default: 'https://www.college.uzhnu.edu.ua' },
});
module.exports = model('Link', linkSchema);
