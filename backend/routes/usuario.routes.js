const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth.middleware');
const db = require('../config/db');
const transporter = require('../config/mail');

// POST /api/usuario/r_a → Asignar un RA a un instructor y notificar
router.post('/r_a', verificarToken, (req, res) => {
  const { usuario_id, competencia_id, r_a_id } = req.body;

  // 0) Parámetros obligatorios
  if (!usuario_id || !competencia_id || !r_a_id) {
    return res.status(400).json({
      mensaje: 'usuario_id, competencia_id y r_a_id son obligatorios'
    });
  }

  // 1) Verificar que el RA existe y pertenece a la competencia indicada
  const sqlRA = `
    SELECT 
      ra.numeros_r_a      AS ra_numero,
      c.nombre            AS comp_nombre
    FROM r_a ra
    JOIN competencia c 
      ON ra.competencia_id = c.id_competencia
    WHERE ra.id_r_a = ? 
      AND ra.competencia_id = ?
  `;
  db.query(sqlRA, [r_a_id, competencia_id], (raErr, raRows) => {
    if (raErr) {
      console.error('[Asignar RA ERROR] al verificar RA:', raErr);
      return res.status(500).json({ mensaje: 'Error al verificar RA' });
    }
    if (raRows.length === 0) {
      return res.status(400).json({ mensaje: 'RA no válido para esta competencia' });
    }
    const { ra_numero, comp_nombre } = raRows[0];

    // 2) Verificar que el usuario ya tenga asignada esa competencia
    const sqlUC = `
      SELECT 1
      FROM usuario_has_competencia
      WHERE usuario_id = ? 
        AND competencia_id = ?
    `;
    db.query(sqlUC, [usuario_id, competencia_id], (ucErr, ucRows) => {
      if (ucErr) {
        console.error('[Asignar RA ERROR] al verificar competencia del usuario:', ucErr);
        return res.status(500).json({ mensaje: 'Error al verificar competencia del usuario' });
      }
      if (ucRows.length === 0) {
        return res.status(400).json({ mensaje: 'RA no válido para esta competencia' });
      }

      // 3) Verificar duplicado
      const sqlDup = `
        SELECT 1
        FROM usuario_has_r_a
        WHERE usuario_id = ? 
          AND r_a_id = ?
      `;
      db.query(sqlDup, [usuario_id, r_a_id], (dupErr, dupRows) => {
        if (dupErr) {
          console.error('[Asignar RA ERROR] al comprobar duplicado:', dupErr);
          return res.status(500).json({ mensaje: 'Error al verificar duplicado' });
        }
        if (dupRows.length > 0) {
          return res.status(409).json({ mensaje: 'RA ya asignado a este usuario' });
        }

        // 4) Obtener datos del usuario (para el correo)
        const sqlUser = `
          SELECT nombre, apellido, correo
          FROM usuario
          WHERE id_usuario = ?
        `;
        db.query(sqlUser, [usuario_id], (userErr, userRows) => {
          if (userErr || userRows.length === 0) {
            console.error('[Asignar RA ERROR] al obtener usuario:', userErr);
            return res.status(404).json({ mensaje: 'Instructor no encontrado' });
          }
          const { nombre, apellido, correo } = userRows[0];

          // 5) Insertar asignación
          const sqlInsert = `
            INSERT INTO usuario_has_r_a (usuario_id, r_a_id, evaluado)
            VALUES (?, ?, 0)
          `;
          db.query(sqlInsert, [usuario_id, r_a_id], async (insErr) => {
            if (insErr) {
              console.error('[Asignar RA ERROR] al insertar RA:', insErr);
              return res.status(500).json({ mensaje: 'Error al asignar RA' });
            }

            // 6) Enviar correo
            const html = `
              <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                background: #FCFCE8;
                padding: 24px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              ">
                <div style="text-align:center; margin-bottom:16px;">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Logo_del_sena.jpg"
                       alt="SENA" width="80" />
                </div>
                <h2 style="color:#00324C; margin-bottom:8px;">
                  Nuevo Resultado de Aprendizaje
                </h2>
                <p>Hola <strong>${nombre} ${apellido}</strong>,</p>
                <p>Se te ha asignado este <strong>Resultado de Aprendizaje</strong>:</p>
                <ul style="list-style:none; padding:0;">
                  <li><strong>Competencia:</strong> ${comp_nombre}</li>
                  <li><strong>RA Número:</strong> ${ra_numero}</li>
                </ul>
                <p style="font-size:0.9em; color:#555;">
                  Ingresa a tu panel de instructor para más detalles.
                </p>
                <hr style="border:none; border-top:1px solid #ccc; margin:24px 0;" />
                <p style="font-size:0.8em; text-align:center; color:#888;">
                  © SENA - Plataforma ACEF
                </p>
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
              console.error('[Asignar RA ERROR] al enviar correo:', mailErr);
              return res.json({ mensaje: 'RA asignado, pero no se pudo enviar el correo' });
            }
          });
        });
      });
    });
  });
});

module.exports = router;
