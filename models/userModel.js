const mongoose = require('mongoose');
const { Schema } = mongoose;

let User;

try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model('User', new Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  }));
}

module.exports = User;
