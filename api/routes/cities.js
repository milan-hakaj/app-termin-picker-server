const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const City = require('../models/City');
const Country = require('../models/Country');

//.populate('_country', 'name')
router.get('/', (req, res, next) => {
  City
    .find()
    .populate('_country')
    .exec()
    .then((response) => {
      res.status(200).json({
        count: response.length,
        cities: response.map((city) => {
          return {
            _id: city._id,
            name: city.name,
            country: {
              _id: city._country._id,
              name: city._country.name,
              citiesCount: city._country.cities.length
            },
            path: `/locations/${city._country.name}/${city.name}`
          }
        }),
      });
    }).catch((error) => {
      res.status(500).json({ error });
    });
});

router.get('/:name', (req, res, next) => {
  const name = req.params.name;

  City
    .findOne({ name: name })
    .populate('_country locations')
    .exec()
    .then((response) => {
      res.status(200).json({
        _id: response._id,
        name: response.name,
        countryDetails: {
          _id: response._country._id,
          name: response._country.name
        },
        locations: {
          count: response.locations.length,
          data: response.locations.map((location) => {
            return {
              _id: location._id,
              name: location.name,
              description: location.description
            }
          })
       },
       path: `/locations/${response._country.name}/${response.name}`
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

router.post('/', (req, res, next) => {
  let city;

  Country.findById(req.body.countryId).exec().then((country) => {
    if(country) {

      city = new City({
        _id: new mongoose.Types.ObjectId(),
        _country: country,
        name: req.body.name
      });

      city.save().then((response) => {
        // update countries
        Country
          .update({
            _id: req.body.countryId
          }, {
            $push: {
              cities: city
            }
          }).then((res) => {
            console.log('object updated');
            // res.status(200).json(response);
          }).catch(e => {
            console.log('not updated', e);
          });
      }).catch((error) => {
        res.status(500).json({ error });
      });

    } else {
      console.log('nat foand');
      // Means object is not found, so he can't add city
      // If countries doesn't exist.
    }
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

  City.update({ _id: id }, {
    $set: updateObject
  }).then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(500).json({ error });
  });

});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  City.remove({ _id: id }).exec().then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(500).json({ error });
  });
});

module.exports = router;

// 5beddff1cc56d609478f8878 serbia id