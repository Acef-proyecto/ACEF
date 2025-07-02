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

/**
 * @swagger
 * tags:
 *   - name: Acta
 *     description: Gestión de actas y su asociación a fichas
 */

/**
 * @swagger
 * /api/acta/subir:
 *   post:
 *     summary: Subir un PDF de acta y asociarlo a una ficha
 *     tags: [Acta]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - archivo
 *               - ficha_id
 *             properties:
 *               archivo:
 *                 type: string
 *                 format: binary
 *                 description: PDF de la acta
 *               ficha_id:
 *                 type: integer
 *                 description: ID de la ficha a la que se asocia
 *     responses:
 *       201:
 *         description: Acta subida y asociada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Acta subida y asociada a ficha correctamente
 *                 actaId:
 *                   type: integer
 *                   example: 42
 *                 url:
 *                   type: string
 *                   example: http://localhost:3000/uploads/actas/1625239073456_mi_acta.pdf
 *       400:
 *         description: Falta archivo o ficha_id
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno al guardar o asociar
 */
router.post(
  '/subir',
  authMiddleware,
  upload.single('archivo'),
  (req, res) => {
    const { ficha_id } = req.body;
    const usuarioId    = req.usuario.id;
    if (!req.file || !ficha_id) {
      return res
        .status(400)
        .json({ mensaje: 'PDF (archivo) y ficha_id son obligatorios' });
    }
    const url = `${req.protocol}://${req.get('host')}/uploads/actas/${req.file.filename}`;

    // Insertar en tabla acta
    db.query(
      'INSERT INTO acta (anexos, usuario_id) VALUES (?, ?)',
      [url, usuarioId],
      (err, result) => {
        if (err) {
          console.error('[Acta ERROR]', err);
          return res.status(500).json({ mensaje: 'Error al guardar acta' });
        }
        const actaId = result.insertId;

        // Relacionar con ficha
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

/**
 * @swagger
 * /api/acta:
 *   get:
 *     summary: Listar actas por ficha y rango de fechas
 *     tags: [Acta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ficha
 *         schema:
 *           type: integer
 *         description: Número de la ficha para filtrar
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha mínima de subida (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha máxima de subida (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de actas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_acta:
 *                     type: integer
 *                   anexos:
 *                     type: string
 *                     format: uri
 *                   instructor:
 *                     type: string
 *                   ficha_numero:
 *                     type: integer
 *                   fecha_subida:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al recuperar actas
 */
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
