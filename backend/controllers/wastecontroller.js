const { getConnection } = require('../config/db');

async function createListing(req, res){
  const { name, category, quantity, price, description } = req.body;
  if(!name || !category || !quantity || !price) return res.status(400).json({message:'Missing fields'});
  const conn = await getConnection();
  try{
    await conn.execute(
      'INSERT INTO LISTINGS (USER_ID, NAME, CATEGORY, QUANTITY, PRICE, DESCRIPTION) VALUES (:uid, :name, :category, :quantity, :price, :description)',
      { uid: req.user.id, name, category, quantity, price, description: description || null },
      { autoCommit: true }
    );
    return res.status(201).json({ message: 'Created' });
  }catch(e){ console.error(e); return res.status(500).json({message:'Server error'});} 
  finally{ await conn.close(); }
}

async function myListings(req, res){
  const conn = await getConnection();
  try{
    const r = await conn.execute('SELECT ID, NAME, CATEGORY, QUANTITY, PRICE, DESCRIPTION, CREATED_AT FROM LISTINGS WHERE USER_ID=:uid ORDER BY CREATED_AT DESC', { uid: req.user.id });
    return res.json(r.rows);
  }catch(e){ console.error(e); return res.status(500).json({message:'Server error'});} 
  finally{ await conn.close(); }
}

module.exports = { createListing, myListings };


