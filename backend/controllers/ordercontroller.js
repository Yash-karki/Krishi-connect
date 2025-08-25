const { getConnection } = require('../config/db');

async function createOrder(req, res){
  const { items } = req.body; // [{productId, quantity, price}]
  if(!Array.isArray(items) || !items.length) return res.status(400).json({message:'No items'});
  const conn = await getConnection();
  try{
    const result = await conn.execute(
      'INSERT INTO ORDERS (USER_ID, STATUS, TOTAL_AMOUNT) VALUES (:uid, :status, :total) RETURNING ID INTO :id',
      { uid: req.user.id, status: 'PLACED', total: items.reduce((s,i)=>s + (i.price*i.quantity), 0), id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER } },
      { autoCommit: false }
    );
    const orderId = result.outBinds.id[0];

    for(const it of items){
      await conn.execute(
        'INSERT INTO ORDER_ITEMS (ORDER_ID, PRODUCT_ID, QUANTITY, PRICE) VALUES (:oid, :pid, :qty, :price)',
        { oid: orderId, pid: it.productId, qty: it.quantity, price: it.price },
        { autoCommit: false }
      );
    }
    await conn.commit();
    return res.status(201).json({ id: orderId });
  }catch(e){ await conn.rollback(); console.error(e); return res.status(500).json({message:'Server error'});} 
  finally{ await conn.close(); }
}

async function listOrders(req, res){
  const conn = await getConnection();
  try{
    const r = await conn.execute('SELECT ID, STATUS, TOTAL_AMOUNT, CREATED_AT FROM ORDERS WHERE USER_ID=:uid ORDER BY CREATED_AT DESC', { uid: req.user.id });
    return res.json(r.rows);
  }catch(e){ console.error(e); return res.status(500).json({message:'Server error'});} 
  finally{ await conn.close(); }
}

module.exports = { createOrder, listOrders };



