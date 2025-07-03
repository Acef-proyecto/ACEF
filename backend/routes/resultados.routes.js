// backend/routes/resultados.routes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/resultados/:id_competencia
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id_r_a, numeros_r_a, descripcion 
    FROM r_a 
    WHERE competencia_id = ?
  `;
  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error('[Resultados] Error al consultar:', err);
      return res.status(500).json({ mensaje: 'Error al obtener resultados' });
    }

    res.json(rows);
  });
});

module.exports = router;
