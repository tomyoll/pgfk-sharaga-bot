const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const actualNewsSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, required: false },
    link:  { type: String, required: true }
  },
);
module.exports = model('ActualNews', actualNewsSchema);
