require('dotenv').config()
const express = require('express');
const router = express.Router();
const { DM, getDMID } = require('../models/DM');
const { MessageDM } = require('../models/MessageDM');
const mongoose = require('mongoose');

router.post('/', (req, res, next) => {
  const { receiverId, senderId, message, timestamp } = req.body;

  const DMID = getDMID(senderId, receiverId);

  const messageDM = new MessageDM({
    _id: new mongoose.Types.ObjectId(),
    receiverId,
    senderId,
    message,
    timestamp
  });

  let DMThread = new DM({
    _id: DMID,
    messages: []
  });

  DM.findOne({ _id: DMID })
    .exec()
    .then(dm => {
      dm.messages.push(messageDM);

      if (!dm) {
        DMThread.save()
          .then(response => res.status(200).json(response))
          .catch(error => res.status({ error }));
      }

      dm.save()
          .then(response => res.status(200).json(response))
          .catch(error => res.status({ error }));

    }).catch(error => {
      res.status({ error });
    });

});


module.exports = router;