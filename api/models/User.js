const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  firstName: { type: String },
  lastName: { type: String, },
  phone: { type: String },
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  }
});

module.exports = mongoose.model('User', userSchema);