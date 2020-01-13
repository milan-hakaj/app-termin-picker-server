const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  name: Schema.Types.String,
  picture: Schema.Types.String,
  email: Schema.Types.String,
  socialMediaData: {
    id: Schema.Types.String,
    name: Schema.Types.String
  }
});

validateUser = userData => {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(20),
    picture: Joi.string(),
    email: Joi.string(),
    socialMediaData: {
      id: Joi.string(),
      name: Joi.string()
    }
  };
  return Joi.validate(userData, schema);
};

validateUserLogin = userData => {
  const schema = {
    email: Joi.string(),
    password: Joi.string()
  };
  return Joi.validate(userData, schema);
};

exports.User = mongoose.model('User', userSchema);
exports.validate = validateUser;
exports.validateLogin = validateUserLogin;
