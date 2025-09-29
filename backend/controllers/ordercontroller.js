const { getConnection } = require('../config/db');

async function createOrder(req, res){
  const { items } = req.body; // [{productId, quantity, price}]
  if(!Array.isArray(items) || !items.length) return res.status(400).json({message:'No items'});
  const conn = await getConnection();
  try{
    await conn.beginTransaction();
    
    // First, validate inventory and check availability
    for(const item of items){
      const [productCheck] = await conn.query(
        'SELECT quantity FROM listings WHERE id = ? FOR UPDATE',
        [item.productId]
      );
      
      if(productCheck.length === 0){
        await conn.rollback();
        return res.status(400).json({message: `Product ${item.productId} not found`});
      }
      
      if(productCheck[0].quantity < item.quantity){
        await conn.rollback();
        return res.status(400).json({
          message: `Insufficient quantity for product ${item.productId}. Available: ${productCheck[0].quantity}, Requested: ${item.quantity}`
        });
      }
    }
    
    const total = items.reduce((s,i)=> s + (Number(i.price)||0)*(Number(i.quantity)||0), 0);
    const [orderRes] = await conn.query(
      'INSERT INTO orders (user_id, status, total_amount) VALUES (?, ?, ?)',
      [req.user.id, 'PLACED', total]
    );
    const orderId = orderRes.insertId;
    
    // Create order items and reduce quantities
    for(const it of items){
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, it.productId, it.quantity, it.price]
      );
      
      // Reduce quantity from listings table
      await conn.query(
        'UPDATE listings SET quantity = quantity - ? WHERE id = ?',
        [it.quantity, it.productId]
      );
      
      // Also reduce quantity from products table if it exists
      await conn.query(
        'UPDATE products SET quantity = GREATEST(0, IFNULL(quantity, 0) - ?) WHERE id = ?',
        [it.quantity, it.productId]
      );
    }
    
    await conn.commit();
    console.log(`Order ${orderId} created successfully with quantity reductions`);
    return res.status(201).json({ id: orderId, message: 'Order placed successfully' });
  }catch(e){
    try{ await conn.rollback(); }catch(_e){}
    console.error('Error creating order:', e);
    return res.status(500).json({message:'Server error while processing order'});
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

// Cancel Order and restore quantities
async function cancelOrder(req, res) {
  const orderId = req.params.id;
  const conn = await getConnection();
  
  try {
    await conn.beginTransaction();
    
    // Check if order exists and belongs to user
    const [orderCheck] = await conn.query(
      'SELECT id, status, user_id FROM orders WHERE id = ? AND user_id = ?',
      [orderId, req.user.id]
    );
    
    if (orderCheck.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (orderCheck[0].status === 'CANCELLED') {
      await conn.rollback();
      return res.status(400).json({ message: 'Order already cancelled' });
    }
    
    if (orderCheck[0].status === 'DELIVERED') {
      await conn.rollback();
      return res.status(400).json({ message: 'Cannot cancel delivered order' });
    }
    
    // Get order items to restore quantities
    const [orderItems] = await conn.query(
      'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
      [orderId]
    );
    
    // Restore quantities
    for (const item of orderItems) {
      await conn.query(
        'UPDATE listings SET quantity = quantity + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
      
      await conn.query(
        'UPDATE products SET quantity = quantity + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }
    
    // Update order status
    await conn.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      ['CANCELLED', orderId]
    );
    
    await conn.commit();
    console.log(`Order ${orderId} cancelled and quantities restored`);
    return res.json({ message: 'Order cancelled successfully' });
    
  } catch (e) {
    try { await conn.rollback(); } catch (_e) {}
    console.error('Error cancelling order:', e);
    return res.status(500).json({ message: 'Server error while cancelling order' });
  } finally {
    conn.release();
  }
}

module.exports = { createOrder, listOrders, cancelOrder };

