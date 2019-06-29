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

  message.save()
    .then(message => {
      DM.findOne({ _id: DMID })
        .exec()
        .then(responseDM => {
          let DMThread = new DM({
            _id: DMID,
            messages: []
          });

          responseDM.messages.push(message);

          if (responseDM) {
            responseDM.save()
              .then(response => res.status(200).json(response))
              .catch(error => res.status({ error }));
          } else {
            DMThread.save()
              .then(response => res.status(200).json(response))
              .catch(error => res.status({ error }));
          }
        })
        .catch(error => res.status({ error }));
    })
    .catch(error => res.status({ error }));
});

router.get('/', (req, res, next) => {
  DM.find()
    .populate('messages')
    .exec()
    .then(response => res.status(200).json(response))
    .catch(error => res.status(500).json({ error }));
});

router.get('/:id', (req, res, next) => {
  DM.findOne({ _id: req.body.id })
    .populate('messages')
    .exec()
    .then(response => res.status(200).json(response))
    .catch(error => res.status(500).json({ error }));
});

module.exports = router;