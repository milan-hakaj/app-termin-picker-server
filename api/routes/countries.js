const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Country = require('../models/Country');

router.get('/', (req, res, next) => {
  Country.find()
    .exec().then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(500).json({ error });
  });
});

router.get('/:name', (req, res, next) => {
  const name = req.params.name;

  Country
    .findOne({ name: name })
    .populate('cities')
    .exec()
    .then((response) => {
      res.status(200).json({
        _id: response._id,
        name:response.name,
        countCities: response.cities.length,
        cities: response.cities.map((city) => {
          return {
            _id: city._id,
            name: city.name,
            path: `/locations/${response.name}/${city.name}`
          }
        }),
        path: `/locations/${name}`
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

router.post('/', (req, res, next) => {
  const country = new Country({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    cities: []
  });

  country.save().then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(500).json({ error });
  });
});


router.patch('/:id', (req, res, next) => {
  const id = req.params.id;
  const updateObject = {};

  req.body.forEach((param) => {
    updateObject[param.propertyName] = param.propertyValue
  });

  Country.update({ _id: id }, {
    $set: updateObject
  }).then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(500).json({ error });
  });

});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Country.remove({ _id: id }).exec().then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(500).json({ error });
  });
});


module.exports = router;