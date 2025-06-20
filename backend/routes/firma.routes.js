// backend/routes/firma.routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

const router = express.Router();

// Configurar almacenamiento con multer
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

// Ruta para subir la firma digital
router.post('/subir/:id_usuario', upload.single('firma'), (req, res) => {
  const { id_usuario } = req.params;

  // ✅ Validar que se haya enviado un archivo
  if (!req.file) {
    return res.status(400).json({ mensaje: 'No se envió ningún archivo' });
  }

  const firmaPath = `uploads/firmas/${req.file.filename}`;

  // Verificar si el usuario puede subir firma
  db.query('SELECT rol FROM usuario WHERE id_usuario = ?', [id_usuario], (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error al buscar el usuario' });
    if (!rows.length) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const { rol } = rows[0];
    if (rol === 'aprendiz') {
      // ❌ Borrar archivo si no tiene permiso
      fs.unlinkSync(path.join(__dirname, '..', firmaPath));
      return res.status(403).json({ mensaje: 'Los aprendices no pueden tener firma digital' });
    }

    // ✅ Actualizar la ruta de firma
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
