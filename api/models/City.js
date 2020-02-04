const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String
  },
  locations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Location'
    }
  ]
});

module.exports = mongoose.model('City', citySchema);
