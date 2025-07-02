const router = require('express').Router();
const db = require('../config/db');

/**
 * @swagger
 * tags:
 *   - name: Trimestre
 *     description: Gestión de periodos académicos o trimestres
 */

/**
 * @swagger
 * /api/trimestre:
 *   post:
 *     summary: Crear un nuevo trimestre académico
 *     tags: [Trimestre]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fecha_inicio
 *               - fecha_fin
 *             properties:
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-15"
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-15"
 *     responses:
 *       201:
 *         description: Trimestre creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Trimestre creado exitosamente
 *       400:
 *         description: Fechas obligatorias no proporcionadas
 *       500:
 *         description: Error interno al guardar el trimestre
 */
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
