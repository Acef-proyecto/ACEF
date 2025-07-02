const router = require('express').Router();
const db = require('../config/db');

/**
 * @swagger
 * tags:
 *   - name: Evaluación
 *     description: Evaluar resultados de aprendizaje (RA)
 */

/**
 * @swagger
 * /api/evaluar:
 *   post:
 *     summary: Marcar un resultado de aprendizaje (RA) como evaluado
 *     tags: [Evaluación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - competencia_id
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 example: 7
 *                 description: ID del usuario (aprendiz o instructor)
 *               competencia_id:
 *                 type: integer
 *                 example: 3
 *                 description: ID de la competencia
 *     responses:
 *       200:
 *         description: RA marcado como evaluado
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
 *                   example: RA marcado como evaluado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno al actualizar RA
 */
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
