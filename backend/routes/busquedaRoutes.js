const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Buscar por ficha específica o por programa
router.get('/buscar', (req, res) => {
  const { ficha, programa } = req.query;

  // Validación básica
  if (!ficha && !programa) {
    return res.status(400).json({ error: 'Debe proporcionar al menos ficha o programa' });
  }

  let query = `
    SELECT 
      f.numero AS ficha,
      p.nombre AS programa
    FROM ficha f
    INNER JOIN programa p ON f.id_programa = p.id_programa
    WHERE 1=1
  `;
  const params = [];

  if (ficha) {
    query += ' AND f.numero = ?';
    params.push(ficha);
  }

  if (programa) {
    query += ' AND p.nombre LIKE ?';
    params.push(`%${programa}%`);
  }

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ error: 'Error en la consulta' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron resultados' });
    }

    res.json(results);
  });
});

module.exports = router;
