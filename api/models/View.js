const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const viewSchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
  _userId: { type: Schema.Types.ObjectId, ref: 'User' },
  views: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }]
});

exports.View = mongoose.model('View', viewSchema);