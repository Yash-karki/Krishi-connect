const { getConnection } = require('../config/db');

// Create Listing
async function createListing(req, res) {
  console.log('=== CREATE LISTING REQUEST ===');
  console.log('Request body:', req.body);
  console.log('User ID:', req.user ? req.user.id : 'undefined');
  console.log('User object:', req.user);
  
  const { name, category, quantity, price, description } = req.body;
  
  // Validate required fields
  if (!name || !category || !quantity || !price) {
    console.error('Missing required fields:', { name, category, quantity, price });
    return res.status(400).json({ message: 'Missing required fields' });
  }

  console.log('Validated payload:', { name, category, quantity, price, description });

  const conn = await getConnection();
  try {
    console.log('Database connection established, starting transaction');
    await conn.beginTransaction();

    // 1. Create listing
    console.log('Inserting into listings table...');
    const [result] = await conn.query(
      'INSERT INTO listings (user_id, name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, name, category, quantity, price, description]
    );
    console.log('Listing inserted successfully, ID:', result.insertId);

    // 2. Also create a product entry so it shows up for buyers
    console.log('Inserting into products table...');
    await conn.query(
      'INSERT INTO products (name, price_per_unit, unit, description) VALUES (?, ?, ?, ?)',
      [name, price, 'Kg', description]
    );
    console.log('Product inserted successfully');

    await conn.commit();
    console.log('Transaction committed successfully');
    
    const response = { message: 'Created', id: result.insertId };
    console.log('Sending response:', response);
    return res.status(201).json(response);
  } catch (e) {
    console.error('Error in createListing:', e);
    console.error('Error stack:', e.stack);
    try {
      await conn.rollback();
      console.log('Transaction rolled back');
    } catch (rollbackError) {
      console.error('Rollback failed:', rollbackError);
    }
    return res.status(500).json({ message: 'Server error: ' + e.message });
  } finally {
    conn.release();
    console.log('Database connection released');
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
    console.log(`Attempting to delete listing ${id} for user ${req.user.id}`);
    
    // First check if the listing exists and belongs to the user
    const [checkResult] = await conn.query(
      'SELECT id, user_id FROM listings WHERE id = ?',
      [id]
    );
    
    if (checkResult.length === 0) {
      console.log(`Listing ${id} not found`);
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    if (checkResult[0].user_id !== req.user.id) {
      console.log(`Listing ${id} does not belong to user ${req.user.id}`);
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }
    
    // Delete the listing
    const [result] = await conn.query(
      'DELETE FROM listings WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    if (result.affectedRows === 0) {
      console.log(`No rows affected when deleting listing ${id}`);
      return res.status(404).json({ message: 'Listing not found or not yours' });
    }
    
    console.log(`Successfully deleted listing ${id}`);
    return res.json({ message: 'Listing deleted successfully' });
  } catch (e) {
    console.error('Error deleting listing:', e);
    return res.status(500).json({ message: 'Server error while deleting listing' });
  } finally {
    conn.release();
  }
}

module.exports = { createListing, myListings, deleteListing };
