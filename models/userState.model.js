const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userStateSchema = new Schema({
  user: { type: String, required: true },
  keyboardState: { type: String, required: true },
});
module.exports = model('UserState', userStateSchema);
