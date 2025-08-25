const oracledb = require("oracledb");
const dbConfig = require("../config/oracleConfig");

async function getConnection() {
  try {
    return await oracledb.getConnection(dbConfig);
  } catch (err) {
    console.error("Oracle DB Connection Error:", err);
    throw err;
  }
}

module.exports = { getConnection };
