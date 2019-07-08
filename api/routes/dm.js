require('dotenv').config()
const express = require('express');
const router = express.Router();
const { DM } = require('../models/DM');
const mongoose = require('mongoose');

router.post('/', (req, res, next) => {
  const { receiverId, senderId, DMID } = req.body;

  const DirectMessage = new DM({
    _id: DMID,
    participants: [
      mongoose.Types.ObjectId(senderId),
      mongoose.Types.ObjectId(receiverId)
    ],
    messages: []
  });

  DirectMessage
    .save()
    .then(DirectMessage => DirectMessage.populate('participants').execPopulate())
    .then(DirectMessage => res.status(200).json({ DM: DirectMessage }))
    .catch(error => res.status(500).json({ error }));
});

router.get('/:id', (req, res, next) => {
  DM.find({ _id : { $regex: req.params.id } }, { messages: { $slice: -10 } })
    .populate([{
        path: 'participants'
      }, {
        path: 'messages',
    }])
    .exec()
    .then(response => res.status(200).json(response))
    .catch(error => res.status(500).json({ error }));
});

module.exports = router;