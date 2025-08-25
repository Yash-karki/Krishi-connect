const { getConnection } = require("./db");

const BuyerModel = {
  async getOrders(buyerId) {
    const conn = await getConnection();
    try {
      const result = await conn.execute(
        `SELECT * FROM ORDERS WHERE BUYER_ID = :buyerId`,
        { buyerId }
      );
      return result.rows;
    } finally {
      await conn.close();
    }
  },

  async placeOrder(order) {
    const conn = await getConnection();
    try {
      const sql = `
        INSERT INTO ORDERS (ORDER_ID, BUYER_ID, PRODUCE_ID, QUANTITY, STATUS)
        VALUES (ORDER_SEQ.NEXTVAL, :buyerId, :produceId, :quantity, 'Pending')
      `;
      const result = await conn.execute(sql, order, { autoCommit: true });
      return result;
    } finally {
      await conn.close();
    }
  }
};

module.exports = BuyerModel;
