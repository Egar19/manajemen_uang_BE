const supabase = require('../config/SupabaseConfig');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthenticationError = require('../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._table = 'users';
  }

  async signUp({ email, password, username }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            email: email
          }
        }
      });

      if (error) {
        console.error('Auth signup error:', error);
        throw new InvariantError(`Gagal mendaftar: ${error.message}`);
      }

      if (data && data.user) {
        console.log('Pendaftaran berhasil:', data);
        return data;
      } else {
        console.log('Silakan periksa email Anda untuk konfirmasi');
        return { message: 'Silakan periksa email Anda untuk konfirmasi' };
      }

    } catch (error) {
      console.error('SignUp function error:', error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Auth login error:', error);
        throw new AuthenticationError(`Gagal login: ${error.message}`);
      }

      if (data && data.user && data.session) {
        return {
          user: data.user,
          session: data.session
        };
      } else {
        throw new AuthenticationError('Email atau password salah.');
      }
    } catch (error) {
      console.error('Login function error:', error);
      throw error;
    }
  }

  async updateUser({ id, email, username }) {
    try {
      const updates = {};
      if (email) updates.email = email;
      if (username) updates.username = username;
      if (Object.keys(updates).length === 0) {
        throw new InvariantError('Tidak ada data yang diupdate.');
      }
      const { data, error } = await supabase
        .from(this._table)
        .update(updates)
        .eq('id', id)
        .select();
      if (error) {
        console.error('Update user error:', error);
        throw new InvariantError(`Gagal update user: ${error.message}`);
      }
      if (!data || data.length === 0) {
        throw new NotFoundError('User tidak ditemukan.');
      }
      return data[0];
    } catch (error) {
      console.error('UpdateUser function error:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const { data, error } = await supabase
        .from(this._table)
        .delete()
        .eq('id', id)
        .select();
      if (error) {
        console.error('Delete user error:', error);
        throw new InvariantError(`Gagal hapus user: ${error.message}`);
      }
      if (!data || data.length === 0) {
        throw new NotFoundError('User tidak ditemukan.');
      }
      return { message: 'User berhasil dihapus', id };
    } catch (error) {
      console.error('DeleteUser function error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Auth logout error:', error);
        throw new AuthenticationError(`Gagal logout: ${error.message}`);
      }
      return { message: 'Logout berhasil' };
    } catch (error) {
      console.error('Logout function error:', error);
      throw error;
    }
  }

}

module.exports = UsersService;
