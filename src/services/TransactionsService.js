/* eslint-disable camelcase */
const supabase = require('../config/SupabaseConfig');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { validateTransactionsPayload } = require('../validator/transactions/index');

class TransactionsService {
  constructor() {
    this._table = 'transactions';
  }

  // eslint-disable-next-line camelcase
  async addTransactions({ profile_id, type, amount, notes, transaction_date }) {
    validateTransactionsPayload({ type, amount, notes, transaction_date });
    const { data, error } = await supabase
      .from(this._table)
      .insert({
        profile_id,
        type,
        amount,
        notes,
        transaction_date,
      })
      .select()
      .single();

    if (error) {
      throw new InvariantError(`Gagal menambahkan transactions: ${error.message}`);
    }

    return data.id;
  }

  async getTransactions({ profile_id, type, startDate, endDate, limit = 20, offset = 0 }) {
    let query = supabase
      .from(this._table)
      .select('*')
      .eq('profile_id', profile_id)
      .order('transaction_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('type', type);
    }
    if (startDate) {
      query = query.gte('transaction_date', startDate);
    }
    if (endDate) {
      query = query.lte('transaction_date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw new InvariantError(`Gagal mengambil data transactions: ${error.message}`);
    }

    return data;
  }

  async getTransactionsById(id, profile_id) {
    const { data, error } = await supabase
      .from(this._table)
      .select('*')
      .eq('id', id)
      .eq('profile_id', profile_id)
      .single();

    if (error || !data) {
      throw new NotFoundError('Transactions tidak ditemukan');
    }

    return data;
  }

  // eslint-disable-next-line camelcase
  async editTransactionsById(id, profile_id, { type, amount, notes, transaction_date }) {
    const { data, error } = await supabase
      .from(this._table)
      .update({
        type,
        amount,
        notes,
        transaction_date,
        inserted_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('profile_id', profile_id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundError('Gagal memperbarui transactions. Id tidak ditemukan');
    }

    return data;
  }

  async deleteTransactionsById(id, profile_id) {
    const { data, error } = await supabase
      .from(this._table)
      .delete()
      .eq('id', id)
      .eq('profile_id', profile_id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundError('Transactions gagal dihapus. Id tidak ditemukan');
    }
  }

  async getSummary(profile_id, { startDate, endDate }) {
    let query = supabase
      .from(this._table)
      .select('type, amount')
      .eq('profile_id', profile_id);

    if (startDate) {
      query = query.gte('transaction_date', startDate);
    }
    if (endDate) {
      query = query.lte('transaction_date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw new InvariantError(`Gagal mengambil summary: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        totalIncome: 0,
        totalOutcome: 0,
        balance: 0,
      };
    }

    const summary = data.reduce(
      (acc, item) => {
        if (item.type === 'income') {
          acc.totalIncome += parseFloat(item.amount);
        } else {
          acc.totalOutcome += parseFloat(item.amount);
        }
        return acc;
      },
      { totalIncome: 0, totalOutcome: 0 }
    );

    summary.balance = summary.totalIncome - summary.totalOutcome;

    return summary;
  }
}

module.exports = TransactionsService;
