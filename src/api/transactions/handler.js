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
    const profile_id = request.auth.credentials.sub;
    const { type, startDate, endDate, limit = '20', offset = '0' } = request.query;

    const transactions = await this._service.getTransactions({
      profile_id,
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
    const profile_id = request.auth.credentials.sub;

    const transactions = await this._service.getTransactionsById(id, profile_id);

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
    const profile_id = request.auth.credentials.sub;
    const { type, amount, notes, transaction_date } = request.payload;

    await this._service.editTransactionsById(id, profile_id, {
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
    const profile_id = request.auth.credentials.sub;

    await this._service.deleteTransactionsById(id, profile_id);

    return {
      status: 'success',
      message: 'Transactions berhasil dihapus',
    };
  }

  async getTransactionsSummaryHandler(request) {

    const profile_id = request.auth.credentials.sub;
    const { startDate, endDate } = request.query;

    const summary = await this._service.getSummary(profile_id, {
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
