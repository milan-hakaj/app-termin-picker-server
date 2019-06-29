const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
  receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
  senderId: { type: Schema.Types.ObjectId, ref: 'User' },
  message: { type: Schema.Types.String },
  timestamp: { type: Schema.Types.String }
});

module.exports.Message = mongoose.model('Message', MessageSchema);
