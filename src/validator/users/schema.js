const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  username: Joi.string().required(),
});

const UserUpdatePayloadSchema = Joi.object({
  email: Joi.string().email(),
  username: Joi.string(),
}).min(1);

const UserIdParamSchema = Joi.object({
  id: Joi.string().required(),
});

const UserLoginPayloadSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = { UserPayloadSchema, UserUpdatePayloadSchema, UserIdParamSchema, UserLoginPayloadSchema };
