const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth.middleware');
const db = require('../config/db');
const transporter = require('../config/mail');

/**
 * @swagger
 * tags:
 *   - name: Usuario
 *     description: Gestión de usuarios e instructores
 */

/**
 * @swagger
 * /api/usuario/r_a:
 *   post:
 *     summary: Asignar un Resultado de Aprendizaje (RA) a un usuario
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - competencia_id
 *               - r_a_id
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 example: 2
 *               competencia_id:
 *                 type: integer
 *                 example: 5
 *               r_a_id:
 *                 type: integer
 *                 example: 14
 *     responses:
 *       200:
 *         description: RA asignado correctamente y notificación enviada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: RA asignado y notificación enviada
 *       400:
 *         description: Datos incompletos o RA inválido
 *       409:
 *         description: RA ya asignado a este usuario
 *       500:
 *         description: Error en la asignación o notificación
 */
router.post('/r_a', verificarToken, (req, res) => {
  const { usuario_id, competencia_id, r_a_id } = req.body;

  if (!usuario_id || !competencia_id || !r_a_id) {
    return res.status(400).json({
      mensaje: 'usuario_id, competencia_id y r_a_id son obligatorios'
    });
  }

  const sqlRA = `
    SELECT 
      ra.numeros_r_a AS ra_numero,
      c.nombre AS comp_nombre
    FROM r_a ra
    JOIN competencia c ON ra.competencia_id = c.id_competencia
    WHERE ra.id_r_a = ? AND ra.competencia_id = ?
  `;
  db.query(sqlRA, [r_a_id, competencia_id], (raErr, raRows) => {
    if (raErr) return res.status(500).json({ mensaje: 'Error al verificar RA' });
    if (raRows.length === 0) {
      return res.status(400).json({ mensaje: 'RA no válido para esta competencia' });
    }
    const { ra_numero, comp_nombre } = raRows[0];

    const sqlUC = `
      SELECT 1 FROM usuario_has_competencia
      WHERE usuario_id = ? AND competencia_id = ?
    `;
    db.query(sqlUC, [usuario_id, competencia_id], (ucErr, ucRows) => {
      if (ucErr) return res.status(500).json({ mensaje: 'Error al verificar competencia del usuario' });
      if (ucRows.length === 0) {
        return res.status(400).json({ mensaje: 'RA no válido para esta competencia' });
      }

      const sqlDup = `
        SELECT 1 FROM usuario_has_r_a
        WHERE usuario_id = ? AND r_a_id = ?
      `;
      db.query(sqlDup, [usuario_id, r_a_id], (dupErr, dupRows) => {
        if (dupErr) return res.status(500).json({ mensaje: 'Error al verificar duplicado' });
        if (dupRows.length > 0) {
          return res.status(409).json({ mensaje: 'RA ya asignado a este usuario' });
        }

        const sqlUser = `
          SELECT nombre, apellido, correo
          FROM usuario
          WHERE id_usuario = ?
        `;
        db.query(sqlUser, [usuario_id], (userErr, userRows) => {
          if (userErr || userRows.length === 0) {
            return res.status(404).json({ mensaje: 'Instructor no encontrado' });
          }
          const { nombre, apellido, correo } = userRows[0];

          const sqlInsert = `
            INSERT INTO usuario_has_r_a (usuario_id, r_a_id, evaluado)
            VALUES (?, ?, 0)
          `;
          db.query(sqlInsert, [usuario_id, r_a_id], async (insErr) => {
            if (insErr) return res.status(500).json({ mensaje: 'Error al asignar RA' });

            const html = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; background: #FCFCE8; padding: 24px; border-radius: 8px;">
                <div style="text-align:center;">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Logo_del_sena.jpg" alt="SENA" width="80" />
                </div>
                <h2 style="color:#00324C;">Nuevo Resultado de Aprendizaje</h2>
                <p>Hola <strong>${nombre} ${apellido}</strong>,</p>
                <p>Se te ha asignado este <strong>Resultado de Aprendizaje</strong>:</p>
                <ul style="padding-left: 0; list-style: none;">
                  <li><strong>Competencia:</strong> ${comp_nombre}</li>
                  <li><strong>RA Número:</strong> ${ra_numero}</li>
                </ul>
                <p style="font-size: 0.9em; color: #555;">Ingresa a tu panel de instructor para más detalles.</p>
                <hr style="border:none; border-top:1px solid #ccc;" />
                <p style="font-size: 0.8em; text-align: center; color: #888;">© SENA - Plataforma ACEF</p>
              </div>
            `;
            try {
              await transporter.sendMail({
                from: '"ACEF - SENA" <notificaciones@acef.com>',
                to: correo,
                subject: "📚 Te han asignado un RA",
                html
              });
              return res.json({ mensaje: 'RA asignado y notificación enviada' });
            } catch (mailErr) {
              console.error('[Correo ERROR]', mailErr);
              return res.json({ mensaje: 'RA asignado, pero no se pudo enviar el correo' });
            }
          });
        });
      });
    });
  });
});

/**
 * @swagger
 * /api/usuario/correo/{correo}:
 *   get:
 *     summary: Buscar usuario por correo
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: correo
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Correo electrónico del usuario a buscar
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 rol:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al buscar usuario
 */
router.get('/correo/:correo', verificarToken, (req, res) => {
  const { correo } = req.params;

  const sql = `
    SELECT id_usuario, nombre, apellido, rol
    FROM usuario
    WHERE correo = ?
  `;

  db.query(sql, [correo], (err, results) => {
    if (err) {
      console.error('❌ Error al buscar usuario por correo:', err);
      return res.status(500).json({ mensaje: 'Error al buscar usuario' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontró un usuario con ese correo' });
    }

    res.json(results[0]);
  });
});

module.exports = router;
