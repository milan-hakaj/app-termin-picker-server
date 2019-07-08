require('dotenv').config()
const express = require('express');
const router = express.Router();
const { Message } = require('../models/Message');
const { DM } = require('../models/DM');

const mongoose = require('mongoose');

router.post('/', (req, res, next) => {
  const { _id, receiverId, senderId, message : text, timestamp } = req.body.messageData;
  const DMID = req.body.DMID;

  const message = new Message({
    _id,
    receiverId,
    senderId,
    message: text,
    timestamp
  });

  message
    .save()
    .then(messageData => messageData)
    .then(messageData => {
      DM.update({ _id: DMID }, {
        $push: {
          messages: messageData
        }
      }).then((res) => res.status(200).json({
        messageData,
        DMID
      }))
      .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
});

module.exports = router;