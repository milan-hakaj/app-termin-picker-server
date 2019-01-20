require('dotenv').config()
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    req.verifiedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch(err) {
    res.status(401).json({
      message: 'Auth failed'
    })
  }

};