const router = require('express').Router();
const db = require('../config/db');

// Crear nuevo trimestre
router.post('/', async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.body;

  if (!fecha_inicio || !fecha_fin) {
    return res.status(400).json({ error: 'Fechas obligatorias' });
  }

  try {
    await db.execute(`
      INSERT INTO trimestre (fecha_inicio, fecha_fin)
      VALUES (?, ?)
    `, [fecha_inicio, fecha_fin]);

    res.status(201).json({ ok: true, message: 'Trimestre creado exitosamente' });
  } catch (err) {
    console.error('[Crear Trimestre]', err);
    res.status(500).json({ ok: false, error: 'Error al crear trimestre' });
  }
});

module.exports = router;
