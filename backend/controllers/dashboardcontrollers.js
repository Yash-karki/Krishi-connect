const { getConnection } = require('../config/db');

// Get Dashboard Summary (income, expenses, total orders, recent orders)
async function getDashboard(req, res) {
  const conn = await getConnection();
  try {
    // Income (sum of all order amounts for this user)
    const [incomeResult] = await conn.query(
      `SELECT IFNULL(SUM(total_price), 0) AS income 
       FROM orders 
       WHERE seller_id = ?`, 
      [req.user.id]
    );

    // Expenses (agar farmer buyer bhi hai to uske kharche)
    const [expenseResult] = await conn.query(
      `SELECT IFNULL(SUM(total_price), 0) AS expenses 
       FROM orders 
       WHERE buyer_id = ?`, 
      [req.user.id]
    );

    // Total Orders
    const [orderCount] = await conn.query(
      `SELECT COUNT(*) AS totalOrders 
       FROM orders 
       WHERE seller_id = ? OR buyer_id = ?`, 
      [req.user.id, req.user.id]
    );

    // Recent Orders
    const [recentOrders] = await conn.query(
      `SELECT id, product_name, quantity, total_price, status, created_at 
       FROM orders 
       WHERE seller_id = ? OR buyer_id = ?
       ORDER BY created_at DESC
       LIMIT 5`, 
      [req.user.id, req.user.id]
    );

    res.json({
      income: incomeResult[0].income,
      expenses: expenseResult[0].expenses,
      totalOrders: orderCount[0].totalOrders,
      recentOrders
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
}

module.exports = { getDashboard };
