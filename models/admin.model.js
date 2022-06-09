const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const adminSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, required: true },
  token: { type: String },
  role: { type: Number, required: true },
});
module.exports = model('Admin', adminSchema);
