const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySchema = Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  cities: [{
    type: Schema.Types.ObjectId,
    ref: 'City'
  }]
});

module.exports = mongoose.model('Country', countrySchema);