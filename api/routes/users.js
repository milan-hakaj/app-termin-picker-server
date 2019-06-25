require('dotenv').config()
const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/auth-guard');
const { User, validate, validateLogin } = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

router.get('/', /*authGuard, */(req, res, next) => {
  User.find()
    .exec().then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(500).json({ error });
  });
});

router.post('/create', (req, res, next) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    });
  }

  console.log(req.body.socialMediaData);

  User
    .where({ 'socialMediaData.id': req.body.socialMediaData.id })
    .exec()
    .then((users) => {
      if (users.length === 0) {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          picture: req.body.picture,
          email: req.body.email,
          socialMediaData: {
            id: req.body.socialMediaData.id,
            name: req.body.socialMediaData.name
          }
        });

        user.save()
          .then(user => res.status(200).json(user))
          .catch(error => res.status(500).json({ error: error }));
      } else {
        const user = users[0];
        const token = jwt.sign({
          _id: user.id,
          picture: user.picture,
          email: user.email,
        }, process.env.JWT_SECRET_KEY, {
          expiresIn: '1h'
        });

        return res.status(200).json({
          success: 'Authentication successful.',
          token
        })
      }
    }).catch((error) => {
      res.status(500).json({ error });
    });
});

router.post('/login', (req, res) => {

  const { error } = validateLogin(req.body);

  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    });
  }

  User
    .findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: "We couldn't find this one. "
        });
      }

      bcrypt.compare(req.body.password, user.password, (error, response) => {
          if(!response) {
            return res.status(400).json({
              error: 'Username or password incorrect'
            })
          }

          const token = jwt.sign({
            _id: user.id,
            email: user.email,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password
          }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
          });

          return res.status(200).json({
            success: 'Authentication successful.',
            token
          })

      });
    }).catch(() => {
      res.status(500).json({ error: "We couldn't find this one." });
    });
});

// User.remove({}, function(err) {
//   console.log('collection removed')
// });

router.delete('/', (req, res, next) => {
  User
    .findOneAndRemove({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) {
        res.status(404).json({
          error: "We couldn't find user with given ID."
        })
      }

      res.status(202).json(user);
    }).catch(() => {
      res.status(500).json({
        error: "Oops, error while trying to remove user."
      });
    });
});

router.get('/:id', (req, res, next) => {
  User
    .findById(req.params.id)
    .exec()
    .then((user) => {
      if (!user) {
        res.status(404).json({
          error: "We couldn't find user with given ID."
        });
      }

      res.status(200).json(user);
  }).catch(() => {
    res.status(500).json({
      error: "Oops, we couldn't find user with given ID."
    });
  });
});

/**
 * TODO
 */
router.put('/:id', (req, res, next) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    });
  }

  bcrypt.hash(req.body.password, null, null, (error, hash) => {
    if (error) {
      return res.status(500).json({ error: error });
    } else {
      req.body.password = hash;

      User
        .findOneAndUpdate({_id: req.params.id}, req.body, { upsert: true })
        .then((user) => {

          return res.status(200).json(user)
        })
        .catch(() => {
          return res.status(500).json({
            error: "Error while trying to update user details."
          })
        });
    }
  });
});

module.exports = router;