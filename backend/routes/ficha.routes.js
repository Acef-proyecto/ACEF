const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Buscar ficha por número (ej: 1234567 → id_ficha)
router.get('/buscar', (req, res) => {
  const numeroFicha = req.query.numero;

  if (!numeroFicha) {
    return res.status(400).json({ mensaje: 'Debes proporcionar el número de ficha.' });
  }

  const sql = 'SELECT id_ficha FROM ficha WHERE numero = ?';
  db.query(sql, [numeroFicha], (err, results) => {
    if (err) {
      console.error('❌ Error al buscar ficha:', err);
      return res.status(500).json({ mensaje: 'Error en el servidor.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Ficha no encontrada.' });
    }

    res.json({ id_ficha: results[0].id_ficha });
  });
});

module.exports = router;
