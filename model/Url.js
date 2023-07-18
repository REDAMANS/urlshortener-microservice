const { Schema, model } = require('mongoose');

const urlSchema = new Schema({
  original_url: String,
  short_url: {
    unique: true,
    type: Number
  },
})

module.exports = model('Url', urlSchema);