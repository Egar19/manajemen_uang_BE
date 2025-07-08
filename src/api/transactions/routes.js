const routes = (handler) => [
  {
    method: 'POST',
    path: '/transactions',
    handler: handler.postTransactionsHandler,
    options: {
      auth: 'supabase_jwt',
    },
  },
  {
    method: 'GET',
    path: '/transactions',
    handler: handler.getTransactionsHandler,
    options: {
      auth: 'supabase_jwt',
    },
  },
  {
    method: 'GET',
    path: '/transactions/summary',
    handler: handler.getTransactionsSummaryHandler,
    options: {
      auth: 'supabase_jwt',
    },
  },
  {
    method: 'GET',
    path: '/transactions/{id}',
    handler: handler.getTransactionsByIdHandler,
    options: {
      auth: 'supabase_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/transactions/{id}',
    handler: handler.putTransactionsByIdHandler,
    options: {
      auth: 'supabase_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/transactions/{id}',
    handler: handler.deleteTransactionsByIdHandler,
    options: {
      auth: 'supabase_jwt',
    },
  },
];

module.exports = routes;
