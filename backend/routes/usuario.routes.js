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

// POST /api/usuario/r_a → Asignar un RA a un usuario (instructor)
router.post(
  '/r_a',
  verificarToken,
  (req, res) => {
    const { usuario_id, r_a_id } = req.body;
    if (!usuario_id || !r_a_id) {
      return res.status(400).json({ mensaje: 'usuario_id y r_a_id son obligatorios' });
    }
    db.query(
      'INSERT INTO usuario_has_r_a (usuario_id, r_a_id) VALUES (?, ?)',
      [usuario_id, r_a_id],
      (err) => {
        if (err) return res.status(500).json({ mensaje: 'Error al asignar RA' });
        res.json({ mensaje: 'RA asignado correctamente' });
      }
    );
  }
);

module.exports = router;
