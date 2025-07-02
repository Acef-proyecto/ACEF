const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

const router = express.Router();

// ───────────────────────
// Configuración de Multer
// ───────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'firmas');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   - name: Firma
 *     description: Gestión de firmas digitales para usuarios autorizados
 */

/**
 * @swagger
 * /api/firma/subir/{id_usuario}:
 *   post:
 *     summary: Subir firma digital para un usuario autorizado
 *     tags: [Firma]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario que sube la firma
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firma
 *             properties:
 *               firma:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen de la firma
 *     responses:
 *       200:
 *         description: Firma subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Firma subida exitosamente
 *                 ruta:
 *                   type: string
 *                   example: /uploads/firmas/1719863512-firma.png
 *       400:
 *         description: No se envió ningún archivo
 *       403:
 *         description: Usuario no autorizado (ej. aprendiz)
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al guardar o validar firma
 */
router.post('/subir/:id_usuario', upload.single('firma'), (req, res) => {
  const { id_usuario } = req.params;

  if (!req.file) {
    return res.status(400).json({ mensaje: 'No se envió ningún archivo' });
  }

  const firmaPath = `uploads/firmas/${req.file.filename}`;

  db.query('SELECT rol FROM usuario WHERE id_usuario = ?', [id_usuario], (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error al buscar el usuario' });
    if (!rows.length) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const { rol } = rows[0];
    if (rol === 'aprendiz') {
      fs.unlinkSync(path.join(__dirname, '..', firmaPath));
      return res.status(403).json({ mensaje: 'Los aprendices no pueden tener firma digital' });
    }

    db.query(
      'UPDATE usuario SET firma = ? WHERE id_usuario = ?',
      [firmaPath, id_usuario],
      (error) => {
        if (error) return res.status(500).json({ mensaje: 'Error al guardar la firma' });
        res.json({ mensaje: 'Firma subida exitosamente', ruta: `/${firmaPath}` });
      }
    );
  });
});

module.exports = router;
