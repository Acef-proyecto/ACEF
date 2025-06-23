// backend/controllers/alerta.controller.js
const db = require('../config/db');
const mailer = require('../config/mail');

exports.enviarPorTrimestre = async (req, res) => {
  const { mensaje, correo_instructor, fecha_inicio, fecha_fin } = req.body;
  try {
    // 1) Inserta alerta
    const [r] = await db.execute(
      `INSERT INTO alerta (mensaje, fecha_alerta, tipo)
       VALUES (?, CURDATE(), 1)`,
      [mensaje]
    );
    const id_alerta = r.insertId;

    // 2) Busca trimestres en rango y vincula
    const [ts] = await db.execute(
      `SELECT id_trimestre FROM trimestre
       WHERE fecha_inicio >= ? AND fecha_fin <= ?`,
      [fecha_inicio, fecha_fin]
    );
    for (let t of ts) {
      await db.execute(
        `INSERT INTO alerta_has_trimestre (alerta_id, trimestre_id)
         VALUES (?, ?)`,
        [id_alerta, t.id_trimestre]
      );
    }

    // 3) Envía correo
    await mailer.sendMail({
        from: `"ACEF SENA" <${process.env.EMAIL_USER}>`,
        to: correo_instructor,
        subject: '📢 Nueva Alerta Trimestral - ACEF',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align: center;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Logo_del_sena.jpg" alt="SENA" width="100" style="margin-bottom: 15px;">
            </div>
            <h2 style="color: #1e5631; text-align: center;">📅 Nueva Alerta de Trimestre</h2>
            <p style="color: #333; font-size: 16px;">Hola,</p>
            <p style="color: #333; font-size: 16px;">
                Se ha generado una nueva alerta para el periodo entre <strong>${fecha_inicio}</strong> y <strong>${fecha_fin}</strong>.
            </p>
            <blockquote style="border-left: 4px solid #1e5631; padding-left: 12px; color: #555; margin: 20px 0; font-style: italic;">
                ${mensaje}
            </blockquote>
            <p style="color: #555; font-size: 14px;">Por favor, revisa tus actividades y mantente al día con las evaluaciones.</p>
            <hr style="margin: 30px 0;">
            <footer style="text-align: center; font-size: 12px; color: #aaa;">
                © ACEF - SENA | Este mensaje fue generado automáticamente.
            </footer>
            </div>
        `,
    });

    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo enviar alerta' });
  }
};
