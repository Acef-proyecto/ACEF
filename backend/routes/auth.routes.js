const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticación y recuperación de acceso
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Apellido
 *               - Correo
 *               - Contraseña
 *               - rol
 *               - contacto
 *             properties:
 *               Nombre:
 *                 type: string
 *                 example: Juan
 *               Apellido:
 *                 type: string
 *                 example: Pérez
 *               Correo:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               Contraseña:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *               rol:
 *                 type: string
 *                 example: instructor
 *               contacto:
 *                 type: string
 *                 example: "3184623695"
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos inválidos o correo ya registrado
 */
router.post('/register', authController.registrar);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Correo
 *               - Contraseña
 *             properties:
 *               Correo:
 *                 type: string
 *                 example: juan@example.com
 *               Contraseña:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar restablecimiento de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo  # Cambié 'email' por 'correo' para que coincida con el backend
 *             properties:
 *               correo:
 *                 type: string
 *                 example: juan@example.com
 *     responses:
 *       200:
 *         description: Enlace de restablecimiento enviado si el correo existe
 *       400:
 *         description: Correo inválido
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Restablecer contraseña usando token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de restablecimiento de contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Contraseña
 *             properties:
 *               password:
 *                 type: string
 *                 example: nuevaClave123
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Token inválido o expirado
 */
router.post('/reset-password/:token', authController.resetPassword);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   get:
 *     summary: Verificar si el token de restablecimiento es válido
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token para verificar
 *     responses:
 *       200:
 *         description: Token válido
 *       400:
 *         description: Token inválido o expirado
 */
router.get('/reset-password/:token', authController.verificarTokenReset);

module.exports = router;
