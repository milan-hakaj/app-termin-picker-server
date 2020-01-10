require('dotenv').config();
const express = require('express');
const router = express.Router();
const { View } = require('../models/View');
const mongoose = require('mongoose');

router.get('/:userId', (req, res, next) => {
  View
    .findOne({ _userId: req.params.userId }, { views: { $slice: -10 } })
    .populate({ path: 'views' })
    .exec()
    .then(result => {
      if (!result) {
        return res.status(201).json({
          views: []
        })
      } else {
        return res.status(200).json(result);
      }
    })
    .catch(error => res.status(500).json({ error }));
});

router.post('/add', (req, res, next) => {
  View
    .updateOne({ _userId: req.body.userId }, {
      $push: {
        views: req.body.viewerId
      },
    })
    .populate({ path: 'views' })
    .then(views => res.status(200).json({ views }))
    .catch(error => res.status(500).json({ error }))
});

router.post('/', (req, res, next) => {
  View
    .findOne({ _userId: req.body.userId })
    .exec()
    .then(result => {
      if (!result) {
        const view = new View({
          _id: new mongoose.Types.ObjectId(),
          _userId: req.body.userId,
          views: []
        });

        view
          .save()
          .then(() => res.status(200).json({
            message: "Viewers list created."
          }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        res.status(200).json({
          message: "Viewers list created."
        })
      }
    }).catch((error) => {
      res.status(500).json({ error });
    });
});

module.exports = router;