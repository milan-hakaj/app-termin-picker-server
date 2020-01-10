require('dotenv').config();
const express = require('express');
const router = express.Router();
const Termin = require('../models/Termin');

router.get('/', (req, res, next) => {
  Termin.find()
    .exec()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

router.post('/send-request', (req, res, next) => {
  Termin.collection.insert(req.body.terminList, (err, docs) => {
    if (err) {
      return console.error(err);
    }

    global.io.emit('termin db insert', req.body.terminList);
  });
  return null;
});

router.patch('/update-status', (req, res, next) => {
  const { _id, status } = req.body;

  Termin.updateOne(
    {
      _id
    },
    {
      $set: {
        status
      }
    },
    (err, r) => {
      if (err) return cosnole.log(err);

      global.io.emit('termin db update', { _id, status });
    }
  );
});

module.exports = router;
