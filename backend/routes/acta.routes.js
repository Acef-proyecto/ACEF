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
    const { ficha_id } = req.body;
    const usuarioId    = req.usuario.id;  // ID del instructor que sube
    if (!req.file || !ficha_id) {
      return res
        .status(400)
        .json({ mensaje: 'PDF (archivo) y ficha_id son obligatorios' });
    }
    const url = `${req.protocol}://${req.get('host')}/uploads/actas/${req.file.filename}`;

    // 2.1 Insertar en tabla acta incluyendo usuario_id
    db.query(
      'INSERT INTO acta (anexos, usuario_id) VALUES (?, ?)',
      [url, usuarioId],
      (err, result) => {
        if (err) {
          console.error('[Acta ERROR]', err);
          return res.status(500).json({ mensaje: 'Error al guardar acta' });
        }
        const actaId = result.insertId;

        // 2.2 Relacionar con ficha incluyendo fecha_subida
        db.query(
          'INSERT INTO acta_has_ficha (acta_id, ficha_id, fecha_subida) VALUES (?, ?, NOW())',
          [actaId, ficha_id],
          (err2) => {
            if (err2) {
              console.error('[Acta-Ficha ERROR]', err2);
              return res
                .status(500)
                .json({ mensaje: 'Error al asociar acta con ficha' });
            }
            res.status(201).json({
              mensaje: 'Acta subida y asociada a ficha correctamente',
              actaId,
              url
            });
          }
        );
      }
    );
  }
);

// ── 3) Listar actas por ficha y rango de fechas, mostrando nombre y apellido del instructor
// GET /api/acta?ficha=282505&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/', authMiddleware, (req, res) => {
  const { ficha, startDate, endDate } = req.query;
  let sql = `
    SELECT 
      a.id_acta,
      a.anexos,
      CONCAT(u.nombre, ' ', u.apellido) AS instructor,
      f.numero                         AS ficha_numero,
      ahf.fecha_subida
    FROM acta a
    JOIN usuario u
      ON u.id_usuario = a.usuario_id
    JOIN acta_has_ficha ahf
      ON ahf.acta_id  = a.id_acta
    JOIN ficha f
      ON f.id_ficha   = ahf.ficha_id
    WHERE 1=1
  `;
  const params = [];

  if (ficha) {
    sql += ' AND f.numero = ?';
    params.push(ficha);
  }
  if (startDate) {
    sql += ' AND ahf.fecha_subida >= ?';
    params.push(startDate);
  }
  if (endDate) {
    sql += ' AND ahf.fecha_subida <= ?';
    params.push(endDate);
  }

  sql += ' ORDER BY ahf.fecha_subida DESC';

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('[Listar Actas ERROR]', err);
      return res.status(500).json({ mensaje: 'Error al recuperar actas' });
    }
    res.json(rows);
  });
});

module.exports = router;
  