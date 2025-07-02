const express = require("express");
const router = express.Router();
const db = require("../config/db");

/**
 * @swagger
 * tags:
 *   - name: Competencia
 *     description: Endpoints relacionados con competencias formativas
 */

/**
 * @swagger
 * /api/competencia:
 *   get:
 *     summary: Obtener la lista de competencias
 *     tags: [Competencia]
 *     responses:
 *       200:
 *         description: Lista de competencias obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_competencia:
 *                     type: integer
 *                     example: 5
 *                   nombre:
 *                     type: string
 *                     example: Aplicar principios de programación orientada a objetos
 *       500:
 *         description: Error del servidor al consultar competencias
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id_competencia, nombre FROM competencia");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener competencias:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
});

module.exports = router;
