const { getConnection } = require("../config/db");

const UserModel = {
  async createUser(user) {
    const conn = await getConnection();
    try {
      const [result] = await conn.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [user.name, user.email, user.password, user.role]
      );
      return { insertId: result.insertId };
    } finally {
      conn.release();
    }
  },

  async findUserByEmail(email) {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      return rows[0] || null;
    } finally {
      conn.release();
    }
  }
};

module.exports = UserModel;
