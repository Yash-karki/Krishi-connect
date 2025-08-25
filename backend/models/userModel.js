const { getConnection } = require("../config/db");

const UserModel = {
  async createUser(user) {
    const conn = await getConnection();
    try {
      const [result] = await conn.query(
        'INSERT INTO users (Name, Email, Password, Role) VALUES (?, ?, ?, ?)',
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
      const [rows] = await conn.query('SELECT User_ID as id, Name as name, Email as email, Password as password_hash, Role as role FROM users WHERE Email = ? LIMIT 1', [email]);
      return rows[0] || null;
    } finally {
      conn.release();
    }
  }
};

module.exports = UserModel;
