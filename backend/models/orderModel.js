const { getConnection } = require("./db");

const OrderModel = {
  async updateStatus(orderId, status) {
    const conn = await getConnection();
    try {
      const result = await conn.execute(
        `UPDATE ORDERS SET STATUS = :status WHERE Order_ID = :orderId`,
        { status, orderId },
        { autoCommit: true }
      );
      return result;
    } finally {
      await conn.close();
    }
  }
};

module.exports = OrderModel;
