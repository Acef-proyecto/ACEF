const express = require('express');
const router = express.Router();
const controller = require('../controllers/busqueda.controller');

router.get('/buscar', controller.buscarFichaPrograma);
router.get('/competencias', controller.getCompetencias);
router.get('/resultados', controller.getResultados);
router.get('/aprendices', controller.getAprendices);

module.exports = router;
