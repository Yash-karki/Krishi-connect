const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/db');

async function signup(req, res) {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields: name, email, password' });
  }
  
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET not configured');
    return res.status(500).json({ message: 'Server configuration error' });
  }
  
  const conn = await getConnection();
  try {
    const [existing] = await conn.query('SELECT User_ID FROM users WHERE LOWER(Email) = LOWER(?) LIMIT 1', [email]);
    if (existing.length) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await conn.query(
      'INSERT INTO users (Name, Email, Password, Role) VALUES (?, ?, ?, ?)',
      [name, email.toLowerCase(), hash, role || 'Buyer']
    );
    
    const userId = result.insertId;
    const token = jwt.sign(
      { id: userId, name, email, role: role || 'Buyer' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    return res.status(201).json({ 
      token, 
      user: { id: userId, name, email, role: role || 'Buyer' } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error during signup' });
  } finally { 
    conn.release(); 
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields: email, password' });
  }
  
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET not configured');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT User_ID, Name, Email, Password, Role FROM users WHERE LOWER(Email)=LOWER(?) LIMIT 1', 
      [email]
    );
    
    if (!rows.length) {
      return res.status(401).json({ message: 'Email not found or password incorrect' });
    }
    
    const row = rows[0];
    const passwordValid = await bcrypt.compare(password, row.Password);
    
    if (!passwordValid) {
      return res.status(401).json({ message: 'Email not found or password incorrect' });
    }
    
    const token = jwt.sign(
      { id: row.User_ID, name: row.Name, email: row.Email, role: row.Role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    return res.json({ 
      token, 
      user: { id: row.User_ID, name: row.Name, email: row.Email, role: row.Role } 
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  } finally { 
    conn.release(); 
  }
}

async function me(req, res) {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT User_ID as id, Name as name, Email as email, Role as role FROM users WHERE User_ID = ? LIMIT 1', 
      [req.user.id]
    );
    
    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json(rows[0]);
  } catch (error) { 
    console.error('Profile fetch error:', error); 
    return res.status(500).json({ message: 'Server error fetching profile' }); 
  } finally { 
    conn.release(); 
  }
}

module.exports = { signup, login, me };



