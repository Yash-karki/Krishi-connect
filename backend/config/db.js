const mysql = require('mysql2/promise');

let pool;

async function initMySQLPool() {
	if (pool) return pool;
	pool = mysql.createPool({
		host: process.env.MYSQL_HOST || 'localhost',
		user: process.env.MYSQL_USER || 'root',
		password: process.env.MYSQL_PASSWORD || '',
		database: process.env.MYSQL_DB || 'KrishiConnect',
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0
	});
	// sanity check connection
	const conn = await pool.getConnection();
	await conn.ping();
	conn.release();
	return pool;
}

async function getConnection() {
	if (!pool) await initMySQLPool();
	return pool.getConnection();
}

module.exports = { initMySQLPool, getConnection };
