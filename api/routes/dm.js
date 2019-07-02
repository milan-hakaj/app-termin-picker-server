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
            participants: [
              mongoose.Types.ObjectId(senderId),
              mongoose.Types.ObjectId(receiverId)
            ],
            messages: []
          });

          if (responseDM) {
            responseDM.messages.push(message);
            responseDM.save()
              .then(response => res.status(200).json(response))
              .catch(error => res.status({ error }));
          } else {
            DMThread.messages.push(message);
            DMThread.save()
              .then(response => res.status(200).json(response))
              .catch(error => res.status({ error }));
          }
        })
        .catch(error => res.status({ error }));
    })
    .catch(error => res.status({ error }));
});

router.get('/:id', (req, res, next) => {
  DM.find({ _id : { $regex: req.params.id } })
    .populate([{
        path: 'participants'
      },
      {
      path: 'messages',
      populate: [{
        path: 'senderId',
        model: 'User',
      }, {
        path: 'receiverId',
        model: 'User',
      }]
    }])
    .exec()
    .then(response => res.status(200).json(response))
    .catch(error => res.status(500).json({ error }));
});

// pagination, load more, etc...
// router.get('/:id', (req, res, next) => {
//   DM.findOne({ _id: req.params.id })
//     .populate('messages')
//     .exec()
//     .then(response => res.status(200).json(response))
//     .catch(error => res.status(500).json({ error }));
// });

module.exports = router;