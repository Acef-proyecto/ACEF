const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth.middleware');
const db = require('../config/db');

// GET /api/usuario/firma → Devuelve firma del usuario autenticado
router.get('/firma', verificarToken, (req, res) => {
  const id = req.usuario.id;

  db.query('SELECT firma FROM usuario WHERE id_usuario = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error al consultar firma' });
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    res.json({ firma: rows[0].firma });
  });
});

module.exports = router;
