const Joi = require('joi');

const TransactionsPayloadSchema = Joi.object({
  type: Joi.string().valid('income', 'outcome').required(),
  amount: Joi.number().positive().required(),
  notes: Joi.string().allow(''),
  // eslint-disable-next-line camelcase
  transaction_date: Joi.date().required(),
  profileId: Joi.string().uuid().optional(),
});

module.exports = { TransactionsPayloadSchema };
