const mysql = require("mysql2");
require('dotenv').config();

console.log("🔧 DB Config:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "railway",
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

let dbConnected = false;

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err.code, err.message);
    dbConnected = false;
  } else {
    console.log("✅ MySQL Connected Successfully");
    dbConnected = true;
    connection.release();
  }
});

module.exports = pool;
module.exports.isConnected = () => dbConnected;
