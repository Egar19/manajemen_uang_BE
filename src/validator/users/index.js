const InvariantError = require('../../exceptions/InvariantError');
const { UserPayloadSchema, UserUpdatePayloadSchema, UserIdParamSchema, UserLoginPayloadSchema } = require('./schema');

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUserUpdatePayload: (payload) => {
    const validationResult = UserUpdatePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUserIdParam: (params) => {
    const validationResult = UserIdParamSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUserLoginPayload: (payload) => {
    const validationResult = UserLoginPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
