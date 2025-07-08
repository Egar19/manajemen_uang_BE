const InvariantError = require('../../exceptions/InvariantError');
const schema = require('./schema');

const TransactionsValidator = {
  validateTransactionsPayload: (payload) => {
    const validationResult = schema.TransactionsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = TransactionsValidator;
