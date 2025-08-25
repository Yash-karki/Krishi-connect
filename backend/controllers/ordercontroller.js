const { getConnection } = require('../config/db');

async function createOrder(req, res){
  const { items } = req.body; // [{productId, quantity, price}]
  if(!Array.isArray(items) || !items.length) return res.status(400).json({message:'No items'});
  const conn = await getConnection();
  try{
    await conn.beginTransaction();
    const total = items.reduce((s,i)=> s + (Number(i.price)||0)*(Number(i.quantity)||0), 0);
    const [orderRes] = await conn.query(
      'INSERT INTO orders (user_id, status, total_amount) VALUES (?, ?, ?)',
      [req.user.id, 'PLACED', total]
    );
    const orderId = orderRes.insertId;
    for(const it of items){
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, it.productId, it.quantity, it.price]
      );
    }
    await conn.commit();
    return res.status(201).json({ id: orderId });
  }catch(e){
    try{ await conn.rollback(); }catch(_e){}
    console.error(e);
    return res.status(500).json({message:'Server error'});
  } finally { conn.release(); }
}

async function listOrders(req, res){
  const conn = await getConnection();
  try{
    const [rows] = await conn.query(
      'SELECT id, status, total_amount, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    return res.json(rows);
  } catch(e) { 
    console.error(e); 
    return res.status(500).json({message:'Server error'}); 
  } finally { 
    conn.release(); 
  }
}

module.exports = { createOrder, listOrders };

