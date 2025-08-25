const { getConnection } = require("../config/db");

const ProductModel = {
  async getAllProducts() {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query('SELECT id, name, price_per_unit AS price, unit FROM products');
      return rows;
    } finally {
      conn.release();
    }
  }
};

module.exports = ProductModel;