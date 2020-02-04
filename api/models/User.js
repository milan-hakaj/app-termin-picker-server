const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  name: Schema.Types.String,
  email: Schema.Types.String,
  picture: {
    width: Schema.Types.Number,
    height: Schema.Types.Number,
    url: Schema.Types.String
  },
  socialMediaType: {
    userID: Schema.Types.Mixed,
    type: Schema.Types.Mixed
  },
  role: Schema.Types.Number
});

validateUser = userData => {
  // const schema = {
  //   name: Joi.string()
  //     .min(2)
  //     .max(20),
  //   picture: Joi.string(),
  //   email: Joi.string(),
  //   socialMediaData: {
  //     id: Joi.string(),
  //     name: Joi.string()
  //   }
  // };
  // return Joi.validate(userData, schema);
};

validateUserLogin = userData => {
  // const schema = {
  //   email: Joi.string(),
  //   password: Joi.string()
  // };
  // return Joi.validate(userData, schema);
};

exports.User = mongoose.model('User', userSchema);
exports.validate = validateUser;
exports.validateLogin = validateUserLogin;
