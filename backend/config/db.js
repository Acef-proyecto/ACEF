// config/db.js
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

// Crea el pool “normal” (callback API)
const _pool = mysql.createPool({
  host:              process.env.DB_HOST,
  user:              process.env.DB_USER,
  password:          process.env.DB_PASSWORD,
  database:          process.env.DB_NAME,
  port:              parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

// Crea la “vista promisificada” del pool
const promisePool = _pool.promise();

// Exporta un objeto que detecta si pasas callback o no
const pool = {
  // query(sql, params, [callback])
  query(sql, params, cb) {
    if (typeof cb === "function") {
      // Si hay callback, usa la API clásica
      return _pool.query(sql, params, cb);
    }
    // Si no, devuelve la promesa
    return promisePool.query(sql, params);
  },

  // getConnection([callback])
  getConnection(cb) {
    if (typeof cb === "function") {
      return _pool.getConnection(cb);
    }
    return promisePool.getConnection();
  },

  // si usas execute en algún sitio…
  execute(sql, params, cb) {
    if (typeof cb === "function") {
      return _pool.execute(sql, params, cb);
    }
    return promisePool.execute(sql, params);
  },

  // expón directamente `end()` si lo necesitas
  end(cb) {
    return _pool.end(cb);
  },
};

module.exports = pool;
