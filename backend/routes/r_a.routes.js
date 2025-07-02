const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @swagger
 * tags:
 *   - name: Resultados de Aprendizaje
 *     description: Endpoints relacionados con resultados de aprendizaje (RA)
 */

/**
 * @swagger
 * /api/resultados/{competencia_id}:
 *   get:
 *     summary: Obtener resultados de aprendizaje por competencia
 *     tags: [Resultados de Aprendizaje]
 *     parameters:
 *       - in: path
 *         name: competencia_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la competencia
 *     responses:
 *       200:
 *         description: Lista de resultados de aprendizaje para la competencia especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_r_a:
 *                     type: integer
 *                     example: 12
 *                   numeros_r_a:
 *                     type: string
 *                     example: RA1.1
 *                   descripcion:
 *                     type: string
 *                     example: Aplicar principios básicos de calidad en el desarrollo del software
 *       404:
 *         description: No se encontraron resultados para esa competencia
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:competencia_id', async (req, res) => {
  const { competencia_id } = req.params;
  try {
    const [resultados] = await db.query(
      'SELECT id_r_a, numeros_r_a, descripcion FROM r_a WHERE competencia_id = ?',
      [competencia_id]
    );
    res.json(resultados);
  } catch (err) {
    console.error('Error al obtener resultados:', err);
    res.status(500).json({ mensaje: 'Error al obtener resultados' });
  }
});

module.exports = router;
