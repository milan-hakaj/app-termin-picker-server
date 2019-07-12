require('dotenv').config()
const express = require('express');
const router = express.Router();
const { DM } = require('../models/DM');
const mongoose = require('mongoose');
const NUMBER_OF_DM_PER_REQUEST = 1;

router.post('/', (req, res, next) => {
  const DirectMessage = new DM(req.body.DM);

  DM.findOne({ _id: DirectMessage._id })
    .then(result => {
      if (result) {
        result.populate('participants').execPopulate()
          .then(DM => res.status(200).json({ DM }))
          .catch(error => res.status(500).json({ error }))
      } else {
        DirectMessage
          .save()
          .then(DirectMessage => DirectMessage.populate('participants').execPopulate())
          .then(DirectMessage => res.status(200).json({ DM: DirectMessage }))
          .catch(error => res.status(500).json({ error }));
      }
    })
    .catch(error => res.status(500).json({ error }))
});

router.get('/:id', (req, res, next) => {
  DM.find({ _id : { $regex: req.params.id } }, { messages: { $slice: -10 } })
    // .limit(NUMBER_OF_DM_PER_REQUEST)
    .populate([{
        path: 'participants'
      }, {
        path: 'messages',
    }])
    .exec()
    .then(response => res.status(200).json(response))
    .catch(error => res.status(500).json({ error }));
});

router.post('/next/:id', (req, res, next) => {
  DM.find({ _id : { $regex: req.params.id } }, { messages: { $slice: -10 } })
    .skip(req.body.from)
    .limit(req.body.to)
    .populate([{
      path: 'participants'
    }, {
      path: 'messages',
    }])
    .exec()
    .then(response => res.status(200).json(response))
    .catch(error => res.status(500).json({ error }));
});

router.delete('/:id', (req, res, next) => {
  const DMID = req.params.id;

  DM.remove({ _id: DMID })
    .exec()
    .then(() => res.status(200).json({ DMID }))
    .catch((error) => res.status(500).json({ error }));
});


module.exports = router;