// fromProyecto/backend/routes/evaluacion.routes.js
const express = require("express");
const router = express.Router();
const { obtenerEstadoCompetencia } = require("../controllers/evaluacion.controller");

// GET /api/evaluaciones/competencias/estado?fichaId=1&competenciaId=5
router.get("/competencias/estado", obtenerEstadoCompetencia);

module.exports = router;
