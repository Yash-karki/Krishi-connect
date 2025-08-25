const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/db');

async function signup(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const conn = await getConnection();
  try {
    const [existing] = await conn.query('SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await conn.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email.toLowerCase(), hash, role || 'Buyer']
    );
    const userId = result.insertId;
    const token = jwt.sign({ id: userId, name, email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    return res.status(201).json({ token, user: { id: userId, name, email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  } finally { conn.release(); }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  // Sandbox auth
  if (String(process.env.SANDBOX_AUTH || '').toLowerCase() === 'true') {
    const testUser = process.env.SANDBOX_TEST_USER || 'test@example.com';
    const testPass = process.env.SANDBOX_TEST_PASSWORD || 'pass123';
    const role = process.env.SANDBOX_DEFAULT_ROLE || 'Buyer';
    if (email === testUser && password === testPass) {
      const token = jwt.sign({ id: 0, name: 'Sandbox User', email, role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
      return res.json({ token, user: { id: 0, name: 'Sandbox User', email, role } });
    }
  }

  const conn = await getConnection();
  try {
    const [rows] = await conn.query('SELECT id, name, email, password_hash, role FROM users WHERE LOWER(email)=LOWER(?) LIMIT 1', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });
    const row = rows[0];
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: row.id, name: row.name, email: row.email, role: row.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    return res.json({ token, user: { id: row.id, name: row.name, email: row.email, role: row.role } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  } finally { conn.release(); }
}

async function me(req, res){
  const conn = await getConnection();
  try{
    const [rows] = await conn.query('SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1', [req.user.id]);
    if(!rows.length) return res.status(404).json({message:'Not found'});
    return res.json(rows[0]);
  }catch(e){ console.error(e); return res.status(500).json({message:'Server error'}); }
  finally{ conn.release(); }
}

module.exports = { signup, login, me };



