const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/auth-guard');
const userController = require('../controllers/users');
const User = require('../models/User');
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

// TODO
// Login kad se unese dobar email a pogresan password posle ne radi login
router.post('/login', (req, res) => {
  console.log('LALALALA', req.body);
  res.status(200).json({ "ok": "ok" })
  // User.find({ email: req.body.email })
  //   .exec()
  //   .then((users) => {
  //     if (users.length === 0) {
  //       return res.status(401).json({
  //         message: "User doesn't exist."
  //       });
  //     } else {
  //       const user = users[0];
  //
  //       bcrypt.compare(req.body.password, user.password, (error, response) => {
  //         if (error) {
  //           return res.status(401).json({
  //             message: 'Username or password incorrect'
  //           })
  //         }
  //
  //         if (response) {
  //           const token = jwt.sign({
  //             _id: user.id,
  //             email: user.email,
  //             phone: user.phone,
  //             firstName: user.firstName,
  //             lastName: user.lastName
  //           }, 'JWT_SECRET_KEY_NAME', {
  //             expiresIn: '1h'
  //           });
  //
  //           return res.status(200).json({
  //             message: 'Authentication success',
  //             token
  //           })
  //         }
  //       })
  //     }
  //   }).catch((error) => {
  //   res.status(500).json({ error: "no fand" });
  // });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  User.remove({ id: id }).exec().then((response) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(500).json({ error });
  });
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  User.findById(id).exec().then((response) => {
    if(response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({
        error: "Object not found"
      });
    }
  }).catch((error) => {
    res.status(500).json({ error });
  });
});

router.post('/new', (req, res, next) => {
  console.log(req.body);
  User.find({ email: req.body.email })
    .exec().then((response) => {
    if (response.length >= 1) {
      return res.status(409).json({
        error: "User already exists"
      })
    } else {
      bcrypt.hash(req.body.password, null, null, (error, hash) => {
        if (error) {
          return res.status(500).json({ error });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
          });

          user.save().then((response) => {
            res.status(200).json(response);
          }).catch((error) => {
            res.status(500).json({ error });
          });
        }
      });
    }
  }).catch((error) => {
    res.status(500).json({ error });
  });
});

router.put('/:id', (req, res, next) => {
  User.findOneAndUpdate({_id: req.params.id}, req.body.user, { upsert: true })
    .then(r => res.send(200).json(r))
    .catch(e => res.status(400).json(e));
})

module.exports = router;