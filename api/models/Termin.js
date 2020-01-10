const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const terminSchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: { type: Schema.Types.String },
  time: {
    from: { type: Schema.Types.String },
    to: { type: Schema.Types.String }
  },
  status: { type: Schema.Types.String },
  meta: {
    userId: { type: Schema.Types.Number }
  }
});

module.exports = mongoose.model('Termin', terminSchema);
