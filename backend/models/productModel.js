const { getConnection } = require("./db");

const ProductModel = {
  async getAllProducts() {
    const conn = await getConnection();
    try {
      const result = await conn.execute(`SELECT * FROM PRODUCE`);
      return result.rows;
    } finally {
      await conn.close();
    }
  }
};

module.exports = ProductModel;