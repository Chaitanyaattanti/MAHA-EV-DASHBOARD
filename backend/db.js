const mysql = require("mysql2");
require('dotenv').config();

// Use a connection pool instead of a single connection
// This handles lost connections and concurrent requests better
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Chaitu@2006",
  database: process.env.DB_NAME || "cur",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ FATAL: Database Connection Failed!");
    console.error("Error Code:", err.code);
    console.error("Error Message:", err.message);
    console.error("Connection Details (masked):", {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
  } else {
    console.log("✅ Successfully connected to MySQL Database");
    connection.release();
  }
});

module.exports = pool;
