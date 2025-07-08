const { default: autoBind } = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async signUpHandler(request, h) {
    const { email, password, username } = request.payload;
    this._validator.validateUserPayload(request.payload);

    const userId = await this._service.signUp({
      email,
      password,
      username,
    });

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async loginUserHandler(request, h) {
    this._validator.validateUserLoginPayload(request.payload);

    const { email, password } = request.payload;

    const userData = await this._service.login({ email, password });

    const response = h.response({
      status: 'success',
      message: 'User berhasil login',
      data: userData,
    });
    response.code(200);
    return response;
  }

  async updateUserHandler(request, h) {
    this._validator.validateUserUpdatePayload(request.payload);
    const { id } = request.params;
    const { email, username } = request.payload;
    const updatedUser = await this._service.updateUser({ id, email, username });
    const response = h.response({
      status: 'success',
      message: 'User berhasil diupdate',
      data: updatedUser,
    });
    response.code(200);
    return response;
  }

  async deleteUserHandler(request, h) {
    this._validator.validateUserIdParam(request.params);
    const { id } = request.params;
    const result = await this._service.deleteUser(id);
    const response = h.response({
      status: 'success',
      message: result.message,
      data: { id: result.id },
    });
    response.code(200);
    return response;
  }

  async logoutUserHandler(request, h) {
    const result = await this._service.logout();
    const response = h.response({
      status: 'success',
      message: result.message,
    });
    response.code(200);
    return response;
  }

}

module.exports = UsersHandler;
