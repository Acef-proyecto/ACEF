const express = require('express');
const router = express.Router();
const controller = require('../controllers/busqueda.controller');

/**
 * @swagger
 * tags:
 *   - name: Búsqueda
 *     description: Consultas relacionadas con fichas, competencias, resultados y aprendices
 */

/**
 * @swagger
 * /api/busqueda/buscar:
 *   get:
 *     summary: Buscar fichas y programas por términos clave
 *     tags: [Búsqueda]
 *     parameters:
 *       - in: query
 *         name: ficha
 *         required: false
 *         schema:
 *           type: string
 *         description: Número de ficha para buscar
 *       - in: query
 *         name: programa
 *         required: false
 *         schema:
 *           type: string
 *         description: Nombre del programa para buscar
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error al realizar la búsqueda
 */
router.get('/buscar', controller.buscarFichaPrograma);

/**
 * @swagger
 * /api/busqueda/competencias:
 *   get:
 *     summary: Obtener todas las competencias disponibles
 *     tags: [Búsqueda]
 *     parameters:
 *       - in: query
 *         name: ficha
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la ficha para filtrar competencias
 *     responses:
 *       200:
 *         description: Lista de competencias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error al obtener competencias
 */
router.get('/competencias', controller.getCompetencias);

/**
 * @swagger
 * /api/busqueda/resultados:
 *   get:
 *     summary: Obtener resultados de aprendizaje por competencia
 *     tags: [Búsqueda]
 *     parameters:
 *       - in: query
 *         name: competenciaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la competencia
 *     responses:
 *       200:
 *         description: Resultados de aprendizaje obtenidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Falta competenciaId
 *       500:
 *         description: Error al obtener resultados
 */
router.get('/resultados', controller.getResultados);

/**
 * @swagger
 * /api/busqueda/aprendices:
 *   get:
 *     summary: Obtener lista de aprendices por ficha
 *     tags: [Búsqueda]
 *     parameters:
 *       - in: query
 *         name: ficha
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la ficha
 *     responses:
 *       200:
 *         description: Lista de aprendices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Falta fichaId
 *       500:
 *         description: Error al obtener aprendices
 */
router.get('/aprendices', controller.getAprendices);

module.exports = router;
