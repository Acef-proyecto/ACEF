const db = require('../config/db');  // Importa la configuración de la base de datos
const mailer = require('../config/mail');  // Asegúrate de importar el servicio de correo

exports.enviarPorTrimestre = async (req, res) => {
  const { mensaje, correo_instructor, fecha_inicio, fecha_fin } = req.body;

  // Validación para asegurarse que los parámetros son proporcionados
  if (!fecha_inicio || !fecha_fin || !mensaje) {
    return res.status(400).json({ error: 'Las fechas y el mensaje son obligatorios' });
  }

  try {
    // 1) Insertar alerta
    const textoAlerta = mensaje || `Inicio y/o fin de trimestre entre ${fecha_inicio} y ${fecha_fin}`;
    const [r] = await db.execute(
      `INSERT INTO alerta (mensaje, fecha_alerta, tipo)
       VALUES (?, CURDATE(), 1)`,
      [textoAlerta]
    );
    const id_alerta = r.insertId;

    // 2) Vincular trimestres dentro del rango
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

    // 3) Enviar correo si se proporcionó uno
    if (correo_instructor) {
      await mailer.sendMail({
        from: `"ACEF SENA" <${process.env.EMAIL_USER}>`,
        to: correo_instructor,
        subject: '📢 Nueva Alerta Trimestral - ACEF',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2 style="color: #1e5631;">📅 Nueva Alerta de Trimestre</h2>
            <p>Periodo entre <strong>${fecha_inicio}</strong> y <strong>${fecha_fin}</strong>.</p>
            <blockquote>${mensaje}</blockquote>
            <p>Por favor, revisa tus actividades.</p>
          </div>
        `,
      });
    }

    res.status(201).json({ ok: true });
  } catch (e) {
    console.error('[enviarPorTrimestre ERROR]', e);
    res.status(500).json({ error: 'No se pudo procesar la alerta' });
  }
};
