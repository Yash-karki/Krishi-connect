const { getConnection } = require("../config/db");

const FarmerModel = {
  async addProduce(produce) {
    const conn = await getConnection();
    try {
      const [result] = await conn.query(
        'INSERT INTO products (name, price_per_unit, unit) VALUES (?, ?, ?)',
        [produce.name, produce.price, produce.unit || 'Kg']
      );
      return { insertId: result.insertId };
    } finally {
      conn.release();
    }
  },

  async getProduceByFarmer(farmerId) {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query(
        'SELECT p.* FROM products p WHERE p.user_id = ?',
        [farmerId]
      );
      return rows;
    } finally {
      conn.release();
    }
  }
};

module.exports = FarmerModel;
