const Termin = require('../models/Termin');

exports.fetchAll = (req, res, next) => {
  Termin.find()
    .exec()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};
