const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  firstName: { type: String, minlength: 2, maxlength: 20 },
  lastName: { type: String, minlength: 2, maxlength: 20 },
  phone: { type: String, },
  password: { type: String, required: true, minlength: 5 },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  }
});

validateUser = (userData) => {
  const schema = {
    firstName: Joi.string().min(2).max(20),
    lastName: Joi.string().min(2).max(20),
    phone: Joi.string(),
    email: Joi.string().min(5).required().email({ minDomainAtoms: 2 }),
    password: Joi.string().min(5).max(255).required()
  };
  return Joi.validate(userData, schema);
};

validateUserLogin = (userData) => {
  const schema = {
    email: Joi.string().min(5).required().email({ minDomainAtoms: 2 }),
    password: Joi.string()
  };
  return Joi.validate(userData, schema);
};

exports.User = mongoose.model('User', userSchema);
exports.validate = validateUser;
exports.validateLogin = validateUserLogin;