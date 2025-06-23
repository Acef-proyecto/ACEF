// backend/routes/alerta.routes.js
const router = require('express').Router();
const alertaCtrl = require('../controllers/alerta.controller');

router.post('/trimestre', alertaCtrl.enviarPorTrimestre);

module.exports = router;
