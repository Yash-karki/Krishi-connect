const { getConnection } = require('../config/db');

async function createListing(req, res){
  const { name, category, quantity, price, description } = req.body;
  if(!name || !category || !quantity || !price) return res.status(400).json({message:'Missing fields'});
  const conn = await getConnection();
  try{
    await conn.beginTransaction();
    await conn.query(
      'INSERT INTO listings (user_id, name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, name, category, quantity, price, description || null]
    );
    // Also create a product entry so it shows up for buyers
    await conn.query(
      'INSERT INTO products (name, price_per_unit, unit) VALUES (?, ?, ?)',
      [name, price, 'Kg']
    );
    await conn.commit();
    return res.status(201).json({ message: 'Created' });
  } catch(e) { 
    try{ await conn.rollback(); }catch(_e){}
    console.error(e); 
    return res.status(500).json({message:'Server error'}); 
  } finally { 
    conn.release(); 
  }
}

async function myListings(req, res){
  const conn = await getConnection();
  try{
    const [rows] = await conn.query('SELECT id, name, category, quantity, price, description, created_at FROM listings WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    return res.json(rows);
  } catch(e) { 
    console.error(e); 
    return res.status(500).json({message:'Server error'}); 
  } finally { 
    conn.release(); 
  }
}

module.exports = { createListing, myListings };

