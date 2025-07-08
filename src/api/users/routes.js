const routes = (handler) => [
  {
    method: 'POST',
    path: '/users/signup',
    handler: handler.signUpHandler,
  },
  {
    method: 'POST',
    path: '/users/login',
    handler: handler.loginUserHandler,
  },
  {
    method: 'PUT',
    path: '/users/{id}',
    handler: handler.updateUserHandler,
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: handler.deleteUserHandler,
  },
  {
    method: 'POST',
    path: '/logout',
    handler: handler.logoutUserHandler,
  },
];

module.exports = routes;
