const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Location = require('../models/Location');

// add dotenv
// see why webstorm doesnt support mongoose

router.get('/', (req, res, next) => {
  Location.find()
    .populate({ path: '_city', populate: { path: '_country' }})
    .exec()
    .then((r) => {
      res.status(200).json({
        count: r.length,
        data: r.map((l,i) => {
          console.log(l._city._id, '//////////', i);
          return {
            _id: l._id,
            name: l.name,
            a: l._city._id,
            description: l.description,
            location: {
              city: {
                _id: l._city._id,
                name: l._city.name
              },
              country: {
                _id: l._city._country._id,
                name: l._city._country.name
              }
            },
            address: {
              street: l.street,
              coordinates: {
                lon: l.address.coordinates.lon,
                lat: l.address.coordinates.lat
              }
            },
            contact: {
              phone: l.contact.phone,
              email: l.contact.email,
              workingHours: {
                startingAt: l.contact.workingHours.startingAt,
                closingAt: l.contact.workingHours.closingAt
              }
            },
            path: `/locations/${l._city._country.name}/${l._city.name}/${l.name}`,
            price: {
              perHour: l.price.perHour,
              currency: l.price.currency
            }
          }
        })
      });
    }).catch((error) => {
      res.status(500).json({ error: error.toString() });
    });
});

router.get('/:name', (req, res, next) => {
  const name = req.params.name;
  Location
    .findOne({ name: name })
    .populate({ path: '_city', populate: { path: '_country' }})
    .exec()
    .then((r) => {
      if(r) {
        res.status(200).json({
          _id: r._id,
          name: r.name,
          description: r.description,
          location: {
            city: {
              _id: r._city._id,
              name: r._city.name
            },
            country: {
              _id: r._city._country._id,
              name: r._city._country.name
            }
          },
          address: {
            street: r.street,
            coordinates: {
              lon: r.address.coordinates.lon,
              lat: r.address.coordinates.lat
            }
          },
          contact: {
            phone: r.contact.phone,
            email: r.contact.email,
            workingHours: {
              startingAt: r.contact.workingHours.startingAt,
              closingAt: r.contact.workingHours.closingAt
            }
          },
          path: `/locations/${r._city._country.name}/${r._city.name}/${r.name}`,
          price: {
            perHour: r.price.perHour,
            currency: r.price.currency
          }
        });
      } else {
        res.status(404).json({
          error: "Object not found"
        });
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

  Location.update({ _id: id }, {
    $set: updateObject
  }).then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(500).json({ error });
  });

});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Location.remove({ _id: id }).exec().then((response) => {
      res.status(200).json(response);
    }).catch((error) => {
      res.status(500).json({ error });
    });
});

router.post('/', (req, res, next) => {
  const location = new Location({
    _id: new mongoose.Types.ObjectId(),
    _city: req.body.city,
    name: req.body.name,
    description: req.body.description,
    address: {
      street: req.body.street,
      coordinates: {
        lon: req.body.lon,
        lat: req.body.lat
      }
    },
    contact: {
      phone: req.body.phone,
      email: req.body.email,
      workingHours: {
        startingAt: req.body.opensAt,
        closingAt: req.body.closingAt
      }
    },
    price: {
      perHour: req.body.pricePerHour,
      currency: req.body.currency
    }
  });

  location.save().then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(500).json({ error });
  });

});

module.exports = router;