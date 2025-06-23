const router = require('express').Router();
const db = require('../config/db');

// Asignar competencia (resultado) a instructor
router.post('/', async (req, res) => {
  const { usuario_id, competencia_id } = req.body;

  try {
    await db.execute(`
      INSERT INTO usuario_has_competencia (usuario_id, competencia_id, evaluado)
      VALUES (?, ?, 0)
      ON DUPLICATE KEY UPDATE evaluado = 0
    `, [usuario_id, competencia_id]);

    res.json({ ok: true, message: 'Resultado asignado correctamente' });
  } catch (err) {
    console.error('[Asignación ERROR]', err);
    res.status(500).json({ ok: false, error: 'Error al asignar resultado' });
  }
});

// Marcar RA como evaluado
router.post('/evaluar', async (req, res) => {
  const { usuario_id, competencia_id } = req.body;

  try {
    await db.execute(`
      UPDATE usuario_has_competencia
      SET evaluado = 1
      WHERE usuario_id = ? AND competencia_id = ?
    `, [usuario_id, competencia_id]);

    res.json({ ok: true, message: 'RA marcado como evaluado' });
  } catch (err) {
    console.error('[Evaluar RA]', err);
    res.status(500).json({ ok: false, error: 'Error al actualizar RA' });
  }
});

module.exports = router;
