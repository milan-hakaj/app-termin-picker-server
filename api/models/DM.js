const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DMSchema = Schema({
  _id: mongoose.Schema.Types.String,
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }]
});

getDMID = (senderId, receiverId) => {
  if (senderId < receiverId)
    return senderId + receiverId;

  return receiverId + senderId;
};

module.exports.DM = mongoose.model('DM', DMSchema);
module.exports.getDMID = getDMID;