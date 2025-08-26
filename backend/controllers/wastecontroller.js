const { getConnection } = require('../config/db');

// Create Listing
async function createListing(req, res) {
  const { name, category, quantity, price, description } = req.body;
  if (!name || !category || !quantity || !price)
    return res.status(400).json({ message: 'Missing fields' });

  const conn = await getConnection();
  try {
    await conn.beginTransaction();

    // 1. Create listing
    const [result] = await conn.query(
      'INSERT INTO listings (user_id, name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, name, category, quantity, price, description]
    );

    // 2. Also create a product entry so it shows up for buyers
    await conn.query(
      'INSERT INTO products (name, price_per_unit, unit, description) VALUES (?, ?, ?, ?)',
      [name, price, 'Kg', description]
    );

    await conn.commit();
    return res.status(201).json({ message: 'Created', id: result.insertId });
  } catch (e) {
    try {
      await conn.rollback();
    } catch (_) {}
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
}



// Get My Listings
async function myListings(req, res) {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT id, name, category, quantity, price, description, created_at FROM listings WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    return res.json(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
}


// Delete Listing
async function deleteListing(req, res) {
  const id = req.params.id;
  const conn = await getConnection();
  try {
    const [result] = await conn.query(
      'DELETE FROM listings WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Listing not found or not yours' });
    }
    return res.json({ message: 'Listing deleted successfully' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
}

module.exports = { createListing, myListings, deleteListing };
