require('dotenv').config()
const express = require('express');
const router = express.Router();
const { DM, getDMID } = require('../models/DM');
const { Message } = require('../models/Message');
const mongoose = require('mongoose');

router.post('/', (req, res, next) => {
  const { receiverId, senderId, message : text, timestamp } = req.body;
  const DMID = getDMID(senderId, receiverId);

  const message = new Message({
    _id: new mongoose.Types.ObjectId(),
    receiverId,
    senderId,
    message: text,
    timestamp
  });

  message
    .save()
    .then(message => {
      let DMThread = new DM({
        _id: DMID,
        messages: []
      });

      DM.findOne({ _id: DMID })
        .exec()
        .then(dm => {
          dm.messages.push(message);

          if (!dm.length) {
            console.log('!dm');
            DMThread.save()
              .then(response => res.status(200).json(response))
              .catch(error => res.status({ error }));
          }

          console.log('dm');
          dm.save()
            .then(response => res.status(200).json(response))
            .catch(error => res.status({ error }));

        }).catch(error => {
        res.status({ error });
      });
    })
    .catch(error => res.status({ error }));
});

router.get('/', (req, res, next) => {
  DM.find()
    .populate('messages')
    .exec()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});


module.exports = router;