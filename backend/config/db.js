// fromProyecto/backend/config/db.js
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test de conexión al iniciar
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err);
    process.exit(1);
  }
  console.log("✅ Conexión a la base de datos establecida correctamente.");
  connection.release();
});

module.exports = pool;
