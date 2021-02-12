const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Op', 'user']
  }
});
module.exports = mongoose.model('user', userSchema);

