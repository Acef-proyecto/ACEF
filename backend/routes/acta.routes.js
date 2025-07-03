// backend/routes/acta.routes.js

const express        = require('express');
const multer         = require('multer');
const path           = require('path');
const db             = require('../config/db');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// ── 1) Configuración Multer para almacenar PDFs en /uploads/actas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/actas'));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName  = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}_${safeName}`);
  },
});
const upload = multer({ storage });

// ── 2) Subir acta y asociar a ficha
// POST /api/acta/subir
// Body (form-data):
//    archivo: PDF
//    ficha_id: número de ficha
router.post(
  '/subir',
  authMiddleware,
  upload.single('archivo'),
  (req, res) => {
    const { ficha_id } = req.body; // ← esto es el NÚMERO, no el ID
    const usuarioId = req.usuario.id;

    if (!req.file || !ficha_id) {
      return res.status(400).json({ mensaje: 'PDF (archivo) y ficha_id son obligatorios' });
    }

    // 1. Buscar el ID real de la ficha por su número
    db.query('SELECT id_ficha FROM ficha WHERE numero = ?', [ficha_id], (err, resultados) => {
      if (err) {
        console.error('[FICHA LOOKUP ERROR]', err);
        return res.status(500).json({ mensaje: 'Error al buscar ficha' });
      }

      if (resultados.length === 0) {
        return res.status(404).json({ mensaje: 'Ficha no encontrada' });
      }

      const idFicha = resultados[0].id_ficha;
      const url = `${req.protocol}://${req.get('host')}/uploads/actas/${req.file.filename}`;

      // 2. Insertar el acta
      db.query(
        'INSERT INTO acta (anexos, usuario_id) VALUES (?, ?)',
        [url, usuarioId],
        (err2, result) => {
          if (err2) {
            console.error('[Acta ERROR]', err2);
            return res.status(500).json({ mensaje: 'Error al guardar acta' });
          }

          const actaId = result.insertId;

          // 3. Asociar el acta con el ID real de la ficha
          db.query(
            'INSERT INTO acta_has_ficha (acta_id, ficha_id, fecha_subida) VALUES (?, ?, NOW())',
            [actaId, idFicha],
            (err3) => {
              if (err3) {
                console.error('[Acta-Ficha ERROR]', err3);
                return res.status(500).json({ mensaje: 'Error al asociar acta con ficha' });
              }

              res.status(201).json({
                mensaje: 'Acta subida y asociada a ficha correctamente',
                actaId,
                url,
              });
            }
          );
        }
      );
    });
  }
);

module.exports = router;
