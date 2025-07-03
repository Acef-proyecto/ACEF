// backend/routes/competencia.routes.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/competencias → Lista de competencias
router.get('/', (req, res) => {
  const sql = `SELECT id_competencia, nombre FROM competencia`;

  // ✅ Usa el tercer argumento como callback
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.error('[Competencias] Error al consultar:', err);
      return res.status(500).json({ mensaje: 'Error al obtener competencias' });
    }
    res.json(rows);
  });
});

module.exports = router;
