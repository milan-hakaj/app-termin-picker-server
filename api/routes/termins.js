require('dotenv').config();
const express = require('express');
const router = express.Router();
const Termin = require('../models/Termin');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
  Termin.find()
    .populate('meta.user')
    .exec()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

router.get('/:userId', (req, res, next) => {
  Termin.find({ 'meta.user': req.params.userId })
    .populate('meta.user')
    .exec()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

router.post('/', (req, res, next) => {
  const { termin, userId } = req.body;

  termin.meta = {
    user: mongoose.Types.ObjectId(userId)
  };

  const t = new Termin({
    ...termin,
    _id: new mongoose.Types.ObjectId()
  });

  t.save()
    .then(response => {
      Termin.populate(response, { path: 'meta.user' })
        .then(populatedResponse => {
          res.status(200).json({ termin: populatedResponse });
          global.io.emit('termin db insert', [populatedResponse]);
        })
        .catch(error => res.status(500).json(error));
    })
    .catch(error => res.status(500).json(error));
});

router.post('/send-request', (req, res, next) => {
  const list = req.body.terminList.map(termin => {
    termin.meta.user = mongoose.Types.ObjectId(termin.meta.user);
    return termin;
  });

  Termin.collection.insertMany(list).then(docs => {
    const ids = Object.values(docs.insertedIds);

    Termin.find({
      _id: { $in: ids }
    })
      .populate('meta.user')
      .exec()
      .then(latestTerminList => {
        global.io.emit('termin db insert', latestTerminList);
        return null;
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  });
});

router.patch('/update-status', (req, res, next) => {
  const { _id, status } = req.body;

  Termin.updateOne({ _id }, { $set: { status } }, (err, r) => {
    if (err) return console.log(err);

    global.io.emit('termin db update', { _id, status });
  });
});

module.exports = router;
