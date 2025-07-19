/* eslint-disable camelcase */
const { default: autoBind } = require('auto-bind');

class TransactionsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postTransactionsHandler(request, h) {
    this._validator.validateTransactionsPayload(request.payload);

    const { type, amount, notes, transaction_date } = request.payload;
    // Ambil profile_id dari JWT (sub)
    const profile_id = request.auth.credentials.sub;

    const transactionsId = await this._service.addTransactions({
      profile_id,
      type,
      amount,
      notes,
      transaction_date,
    });

    const response = h.response({
      status: 'success',
      message: 'Transactions berhasil ditambahkan',
      data: {
        transactionsId,
      },
    });
    response.code(201);
    return response;
  }

  async getTransactionsHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { type, startDate, endDate, limit = '20', offset = '0' } = request.query;

    const transactions = await this._service.getTransactions({
      userId,
      type,
      startDate,
      endDate,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    if (!transactions || transactions.length === 0) {
      return {
        status: 'success',
        message: 'Belum ada transactions ditemukan',
        data: {
          transactions: [],
        },
      };
    }

    return {
      status: 'success',
      data: {
        transactions,
      },
    };
  }

  async getTransactionsByIdHandler(request) {
    this._validator.validateTransactionsParams(request.params);

    const { id } = request.params;
    const { id: userId } = request.auth.credentials;

    const transactions = await this._service.getTransactionsById(id, userId);

    return {
      status: 'success',
      data: {
        transactions,
      },
    };
  }

  async putTransactionsByIdHandler(request) {
    this._validator.validateTransactionsParams(request.params);
    this._validator.validateTransactionsPayload(request.payload);

    const { id } = request.params;
    const { id: userId, sub: profile_id } = request.auth.credentials;
    const { type, amount, notes, transaction_date } = request.payload;

    await this._service.editTransactionsById(id, userId, {
      profile_id,
      type,
      amount,
      notes,
      transaction_date,
    });

    return {
      status: 'success',
      message: 'Transactions berhasil diperbarui',
    };
  }

  async deleteTransactionsByIdHandler(request) {
    this._validator.validateTransactionsParams(request.params);

    const { id } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.deleteTransactionsById(id, userId);

    return {
      status: 'success',
      message: 'Transactions berhasil dihapus',
    };
  }

  async getTransactionsSummaryHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { startDate, endDate } = request.query;

    const summary = await this._service.getSummary(userId, {
      startDate,
      endDate,
    });

    if (summary.totalIncome === 0 && summary.totalOutcome === 0) {
      return {
        status: 'success',
        message: 'Belum ada transactions untuk periode ini',
        data: {
          summary: {
            totalIncome: 0,
            totalOutcome: 0,
            balance: 0,
          },
        },
      };
    }

    return {
      status: 'success',
      data: {
        summary,
      },
    };
  }
}

module.exports = TransactionsHandler;
