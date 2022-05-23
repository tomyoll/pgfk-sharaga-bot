const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  telegramId: { type: String, required: true },
  userName: { type: String, required: true },
  chatId: { type: String, required: true },
});
module.exports = model('User', userSchema);
