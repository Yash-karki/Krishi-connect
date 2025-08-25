const { getConnection } = require("../config/db");

const OrderModel = {
  async updateStatus(orderId, status) {
    const conn = await getConnection();
    try {
      const [r] = await conn.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
      );
      return { affectedRows: r.affectedRows };
    } finally {
      conn.release();
    }
  }
};

module.exports = OrderModel;
