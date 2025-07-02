const router = require('express').Router();
const alertaCtrl = require('../controllers/alerta.controller');

/**
 * @swagger
 * tags:
 *   - name: Alerta
 *     description: Alertas enviadas a instructores por trimestre
 */

/**
 * @swagger
 * /api/alerta/trimestre:
 *   post:
 *     summary: Enviar alertas a instructores según trimestre
 *     tags: [Alerta]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trimestre
 *             properties:
 *               trimestre:
 *                 type: string
 *                 example: "2025-1"
 *                 description: Trimestre académico en formato AAAA-T
 *     responses:
 *       200:
 *         description: Alertas generadas y enviadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Alertas enviadas exitosamente
 *       400:
 *         description: Parámetros inválidos o faltantes
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/trimestre', alertaCtrl.enviarPorTrimestre);

module.exports = router;
