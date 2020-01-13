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

router.post('/send-request', (req, res, next) => {
  const list = req.body.terminList.map(termin => {
    termin.meta.user = mongoose.Types.ObjectId(termin.meta.user);
    return termin;
  });

  // const user = await User.findOne({ _id: terminList[0].meta.user._id })

  //   console.log({user})

  // async function asyncForEach(array, callback) {
  //   for (let index = 0; index < array.length; index++) {
  //     await callback(array[index], index, array);
  //   }
  // }

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

  // });
});

router.patch('/update-status', (req, res, next) => {
  const { _id, status } = req.body;

  Termin.updateOne({ _id }, { $set: { status } }, (err, r) => {
    if (err) return console.log(err);

    global.io.emit('termin db update', { _id, status });
  });
});

module.exports = router;
