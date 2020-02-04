require('dotenv').config();
const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/auth-guard');
const { User, validate, validateLogin } = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

router.get(
  '/',
  /*authGuard, */ (req, res, next) => {
    User.find()
      .exec()
      .then(response => {
        res.status(200).json(response);
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  }
);

router.post('/auth', (req, res, next) => {
  User.where({ 'socialMediaType.userID': req.body.user.socialMediaType.userID })
    .exec()
    .then(users => {
      if (users.length === 0) {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.user.name,
          email: req.body.user.email,
          picture: {
            url: req.body.user.picture.url,
            width: req.body.user.picture.width,
            height: req.body.user.picture.height
          },
          socialMediaType: {
            userID: req.body.user.socialMediaType.userID,
            type: req.body.user.socialMediaType.type
          },
          role: req.body.user.role
        });

        user
          .save()
          .then(user => {
            const token = jwt.sign(
              {
                ...user
              },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: '1h'
              }
            );

            return res.status(200).json({
              success: 'New user created & authentication successful.',
              token
            });
          })
          .catch(error => {
            res.status(500).json({ error: 'erra' });
          });
      } else {
        const user = users[0].toObject();

        const token = jwt.sign(
          {
            ...user
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: '1h'
          }
        );

        return res.status(200).json({
          success: 'Authentication successful.',
          token
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

router.post('/login', (req, res) => {
  // const { error } = validateLogin(req.body);

  // if (error) {
  //   return res.status(400).send({
  //     error: error.details[0].message
  //   });
  // }

  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "We couldn't find user with given details"
        });
      }

      const userDetails = user.toObject();

      bcrypt.compare(
        req.body.password,
        userDetails.password,
        (error, response) => {
          console.log(error);
          if (!response) {
            return res.status(400).json({
              message: 'Username or password incorrect'
            });
          }

          const token = jwt.sign(
            {
              _id: userDetails._id,
              name: userDetails.name,
              email: userDetails.email,
              password: userDetails.password,
              role: userDetails.role
            },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: '1h'
            }
          );

          return res.status(200).json({
            message: 'Authentication successful.',
            token
          });
        }
      );
    })
    .catch(() => {
      res.status(500).json({
        message: "We couldn't find user with given details"
      });
    });
});

router.post('/register', (req, res, next) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    ...req.body.user
  });

  user
    .save()
    .then(user => {
      return res.status(200).json({
        message: 'Registration successful.'
      });
    })
    .catch(error => res.status(500).json({ message: error }));

  // User.find({ email })
  //   .exec()
  //   .then(user => {
  //     console.log('user', user);
  //     if (user.length !== 0) {
  //       res.status(404).json({
  //         error: 'User already exist'
  //       });
  //     } else {
  //       bcrypt.hash(req.body.password, null, null, (error, hash) => {
  //         if (error) {
  //           return res.status(500).json({ error: error });
  //         } else {
  //           req.body.password = hash;
  //           const user = {
  //             ...req.body
  //           };

  //           user
  //             .save()
  //             .then(user => {
  //               console.log('succss');
  //               return res.status(200).json(user);
  //             })
  //             .catch(() => {
  //               return res.status(500).json({
  //                 error: 'Error while trying to update user details.'
  //               });
  //             });
  //         }
  //       });

  //       // res.status(200).json({
  //       //   message: 'successfully registered',
  //       //   user: {
  //       //     email,
  //       //     password
  //       //   }
  //       // });
  //     }
  //   })
  //   .catch(() => {
  //     res.status(500).json({
  //       error: 'Oops, there was an error'
  //     });
  //   });
});

//
// // User.remove({}, function(err) {
// //   console.log('collection removed')
// // });

router.delete('/', (req, res, next) => {
  User.findOneAndRemove({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        res.status(404).json({
          error: "We couldn't find user with given ID."
        });
      }

      res.status(202).json(user);
    })
    .catch(() => {
      res.status(500).json({
        error: 'Oops, error while trying to remove user.'
      });
    });
});

router.get('/:id', (req, res, next) => {
  User.find({ _id: req.params.id })
    .exec()
    .then(user => {
      if (!user.length) {
        res.status(404).json({
          error: "We couldn't find user with given ID."
        });
      }

      res.status(200).json(user[0]);
    })
    .catch(() => {
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

      User.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true })
        .then(user => {
          return res.status(200).json(user);
        })
        .catch(() => {
          return res.status(500).json({
            error: 'Error while trying to update user details.'
          });
        });
    }
  });
});

module.exports = router;
