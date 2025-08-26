const { getConnection } = require('../config/db');

async function listProducts(req, res){
  const q = (req.query.q || '').trim().toLowerCase();
  const conn = await getConnection();
  try{
    let sql = 'SELECT id, name, price_per_unit AS price, unit, description FROM products';
    let params = [];
    if(q){ sql += ' WHERE LOWER(name) LIKE ?'; params.push(`%${q}%`); }
    const [rows] = await conn.query(sql, params);
    return res.json(rows);
  } catch(e) { 
    console.error(e); 
    return res.status(500).json({message:'Server error'}); 
  } finally { 
    conn.release(); 
  }
}

async function createProduct(req, res){
  const { name, price, unit } = req.body;
  if(!name || !price) return res.status(400).json({message:'Missing fields'});
  const conn = await getConnection();
  try{
    await conn.query(
      'INSERT INTO products (name, price_per_unit, unit) VALUES (?, ?, ?)',
      [name, price, unit]
    );
    return res.status(201).json({ message: 'Created' });
  } catch(e) { 
    console.error(e); 
    return res.status(500).json({message:'Server error'}); 
  } finally { 
    conn.release(); 
  }
}

module.exports = { listProducts, createProduct };
