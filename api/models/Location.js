const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = Schema({
  _id: Schema.Types.ObjectId,
  _city: { type: Schema.Types.ObjectId, ref: 'City' },
  name: {
    type: String,
    required: true
  },
  description: { type: String },
  address: {
    street: { type: String },
    coordinates: {
      lon: { type: String },
      lat: { type: String }
    }
  },
  contact: {
    phone: { type: String },
    email: { type: String },
    workingHours: {
      startingAt: { type: String },
      closingAt: { type: String }
    }
  },
  price: {
    perHour: { type: Number },
    currency: { type: String }
  }
});

module.exports = mongoose.model('Location', locationSchema);