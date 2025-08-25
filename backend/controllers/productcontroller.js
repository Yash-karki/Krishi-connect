const { getConnection } = require('../config/db');

async function listProducts(req, res){
  const q = (req.query.q || '').trim().toLowerCase();
  const conn = await getConnection();
  try{
    let sql = 'SELECT ID, NAME, PRICE_PER_UNIT AS PRICE, UNIT FROM PRODUCTS';
    let binds = {};
    if(q){ sql += ' WHERE LOWER(NAME) LIKE :q'; binds.q = `%${q}%`; }
    const r = await conn.execute(sql, binds);
    return res.json(r.rows);
  }catch(e){ console.error(e); return res.status(500).json({message:'Server error'}); }
  finally{ await conn.close(); }
}

async function createProduct(req, res){
  const { name, price, unit } = req.body;
  if(!name || !price) return res.status(400).json({message:'Missing fields'});
  const conn = await getConnection();
  try{
    await conn.execute(
      'INSERT INTO PRODUCTS (NAME, PRICE_PER_UNIT, UNIT) VALUES (:name, :price, :unit)',
      { name, price, unit: unit || 'Kg' },
      { autoCommit: true }
    );
    return res.status(201).json({ message: 'Created' });
  }catch(e){ console.error(e); return res.status(500).json({message:'Server error'}); }
  finally{ await conn.close(); }
}

module.exports = { listProducts, createProduct };


