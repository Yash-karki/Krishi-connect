const { getConnection } = require("./db");

const FarmerModel = {
  async addProduce(produce) {
    const conn = await getConnection();
    try {
      const sql = `
        INSERT INTO PRODUCE (Produce_ID, Farmer_ID, Name, Quantity, Price)
        VALUES (PRODUCE_SEQ.NEXTVAL, :farmerId, :name, :quantity, :price)
      `;
      const result = await conn.execute(sql, produce, { autoCommit: true });
      return result;
    } finally {
      await conn.close();
    }
  },

  async getProduceByFarmer(farmerId) {
    const conn = await getConnection();
    try {
      const result = await conn.execute(
        `SELECT * FROM PRODUCE WHERE Farmer_ID = :farmerId`,
        { farmerId }
      );
      return result.rows;
    } finally {
      await conn.close();
    }
  }
};

module.exports = FarmerModel;
