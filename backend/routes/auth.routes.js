const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Registro y login
router.post('/register',         authController.registrar);
router.post('/login',            authController.login);

// Recuperación de contraseña
router.post('/forgot-password',  authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/reset-password/:token', authController.verificarTokenReset);

module.exports = router;
