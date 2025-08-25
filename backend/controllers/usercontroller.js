const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/db');

async function signup(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const conn = await getConnection();
  try {
    const existing = await conn.execute(
      'SELECT ID FROM USERS WHERE LOWER(EMAIL) = :email',
      { email: email.toLowerCase() }
    );
    if (existing.rows.length) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const result = await conn.execute(
      'INSERT INTO USERS (NAME, EMAIL, PASSWORD_HASH, ROLE) VALUES (:name, :email, :hash, :role) RETURNING ID INTO :id',
      { name, email: email.toLowerCase(), hash, role: 'Buyer', id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER } },
      { autoCommit: true }
    );
    const userId = result.outBinds.id[0];
    const token = jwt.sign({ id: userId, name, email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    return res.status(201).json({ token, user: { id: userId, name, email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  } finally { await conn.close(); }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  const conn = await getConnection();
  try {
    const r = await conn.execute('SELECT ID, NAME, EMAIL, PASSWORD_HASH FROM USERS WHERE LOWER(EMAIL)=:email', { email: email.toLowerCase() });
    if (!r.rows.length) return res.status(401).json({ message: 'Invalid credentials' });
    const row = r.rows[0];
    const ok = await bcrypt.compare(password, row.PASSWORD_HASH);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: row.ID, name: row.NAME, email: row.EMAIL }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    return res.json({ token, user: { id: row.ID, name: row.NAME, email: row.EMAIL } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  } finally { await conn.close(); }
}

module.exports = { signup, login };


