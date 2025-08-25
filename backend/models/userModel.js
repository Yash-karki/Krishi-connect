const { getConnection } = require("./db");

const UserModel = {
  async createUser(user) {
    const conn = await getConnection();
    try {
      const sql = `
        INSERT INTO USERS (USER_ID, NAME, EMAIL, PASSWORD, ROLE)
        VALUES (USER_SEQ.NEXTVAL, :name, :email, :password, :role)
      `;
      const result = await conn.execute(sql, user, { autoCommit: true });
      return result;
    } finally {
      await conn.close();
    }
  },

  async findUserByEmail(email) {
    const conn = await getConnection();
    try {
      const result = await conn.execute(
        `SELECT * FROM USERS WHERE EMAIL = :email`,
        { email }
      );
      return result.rows[0];
    } finally {
      await conn.close();
    }
  }
};

module.exports = UserModel;
