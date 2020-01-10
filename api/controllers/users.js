const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

exports.get_user = (req, res, next) => {
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
};

// exports.users_get_all = (req, res, next) => {
//   User.find()
//     .exec().then((response) => {
//     res.status(200).json(response);
//   }).catch((error) => {
//     res.status(500).json({ error });
//   });
// };

// exports.user_login = (req, res, next) => {
//   console.log('req', req.body);
//   User.find({ email: req.body.email })
//     .exec().then((response) => {
//       if (response.length === 0) {
//         console.log('=== 0');
//         return res.status(401).json({
//           message: "Authentication failed"
//         });
//       } else {
//         const user = response[0];
//         console.log('user=[0]', user);
//
//         bcrypt.compare(req.body.password, user.password, (error, response) => {
//           if (error) {
//             console.log('bc error');
//             return res.status(401).json({
//               message: 'Authentication failed'
//             })
//           }
//
//           console.log('res what?', response);
//
//           if (response) {
//             const token = jwt.sign({
//               email: user.email,
//               userId: user.id,
//               phone: user.phone,
//               firstName: user.firstName,
//               lastName: user.lastName
//             }, 'JWT_SECRET_KEY_NAME', {
//               expiresIn: '1h'
//             });
//
//             console.log('baout to return auth message')
//             return res.status(200).json({
//               message: 'Authentication success',
//               token
//             })
//           }
//         })
//       }
//     }).catch((error) => {
//       res.status(500).json({ error });
//     });
// };

// exports.user_delete = (req, res, next) => {
//   const id = req.params.id;
//   User.remove({ id: id }).exec().then((response) => {
//     res.status(200).json(response);
//   }).catch((error) => {
//     res.status(500).json({ error });
//   });
// };

// exports.user_new = (req, res, next) => {
//   console.log(req.body);
//   User.find({ email: req.body.email })
//     .exec().then((response) => {
//     if (response.length >= 1) {
//       return res.status(409).json({
//         error: "User already exists"
//       })
//     } else {
//       bcrypt.hash(req.body.password, null, null, (error, hash) => {
//         if (error) {
//           return res.status(500).json({ error });
//         } else {
//           const user = new User({
//             _id: new mongoose.Types.ObjectId(),
//             email: req.body.email,
//             password: hash
//           });
//
//           user.save().then((response) => {
//             res.status(200).json(response);
//           }).catch((error) => {
//             res.status(500).json({ error });
//           });
//         }
//       });
//     }
//   }).catch((error) => {
//     res.status(500).json({ error });
//   });
// };

exports.user_update = (req, res, next) => {
  User.findOneAndUpdate({_id: req.params.id}, req.body.user, { upsert: true })
    .then(r => res.send(200).json(r))
    .catch(e => res.status(400).json(e));
};


