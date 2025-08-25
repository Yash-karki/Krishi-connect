const { getConnection } = require("../config/db");

const BuyerModel = {
  async getOrders(buyerId) {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [buyerId]
      );
      return rows;
    } finally {
      conn.release();
    }
  },

  async placeOrder(order) {
    const conn = await getConnection();
    try {
      await conn.beginTransaction();
      const [r] = await conn.query(
        'INSERT INTO orders (user_id, status, total_amount) VALUES (?, ?, ?)',
        [order.buyerId, 'Pending', Number(order.totalAmount)]
      );
      const orderId = r.insertId;
      if (Array.isArray(order.items)) {
        for (const it of order.items) {
          await conn.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [orderId, it.produceId, it.quantity, it.price]
          );
        }
      }
      await conn.commit();
      return { id: orderId };
    } catch (e) {
      try{ await conn.rollback(); }catch(_e){}
      throw e;
    } finally {
      conn.release();
    }
  }
};

module.exports = BuyerModel;
