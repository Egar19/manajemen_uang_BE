require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

const users = require('./api/users');
const transactions = require('./api/transactions');

const UsersService = require('./services/UsersService');
const TransactionsService = require('./services/TransactionsService');

const UsersValidator = require('./validator/users');
const TransactionsValidator = require('./validator/transactions');

// eslint-disable-next-line no-unused-vars
const jwt = require('jsonwebtoken');

const init = async () => {
  const usersService = new UsersService();
  const transactionsService = new TransactionsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(require('hapi-auth-jwt2'));
  // eslint-disable-next-line no-unused-vars
  const validate = async (decoded, request, h) => {
    console.log('JWT Decoded:', decoded);
    return { isValid: true, credentials: decoded };
  };

  server.auth.strategy('supabase_jwt', 'jwt', {
    key: process.env.SUPABASE_JWT_PUBLIC_KEY.replace(/\\n/g, '\n'),
    validate,
    verifyOptions: { algorithms: ['ES256'] },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (response.output && response.output.statusCode === 401) {
        const newResponse = h.response({
          status: 'fail',
          message: 'Token tidak valid',
        });
        newResponse.code(401);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    return h.continue;
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: transactions,
      options: {
        service: transactionsService,
        validator: TransactionsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();