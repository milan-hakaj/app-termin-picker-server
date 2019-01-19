const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
  _country: { type: Schema.Types.ObjectId, ref: 'Country' },
  name: {
    type: String,
    required: true
  },
  locations: [{
    type: Schema.Types.ObjectId, ref: 'Location'
  }]
});

module.exports = mongoose.model('City', citySchema);