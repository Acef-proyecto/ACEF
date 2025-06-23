// backend/services/alertService.js

const cron        = require('node-cron');
const transporter = require('../config/mail');
const db          = require('../config/db');      // ← sin .promise()
const { format }  = require('date-fns');

// 1) Obtener trimestres de hoy o con offset
async function fetchTrimestresByOffset(daysOffset = null) {
  if (daysOffset === null) {
    const [rows] = await db.execute(`
      SELECT id_trimestre, fecha_inicio, fecha_fin
      FROM trimestre
      WHERE DATE(fecha_inicio) = CURDATE()
         OR DATE(fecha_fin)    = CURDATE()
    `);
    return rows;
  }
  const [rows] = await db.execute(`
    SELECT id_trimestre, fecha_inicio, fecha_fin
    FROM trimestre
    WHERE DATE(fecha_fin) = DATE_ADD(CURDATE(), INTERVAL ? DAY)
  `, [daysOffset]);
  return rows;
}

// 2) Instructores activos
async function fetchInstructores() {
  const [rows] = await db.execute(`
    SELECT id_usuario, nombre, apellido, correo
    FROM usuario
    WHERE rol = 'instructor'
      AND estado = 'activo'
  `);
  return rows;
}

// 3) Resultados de aprendizaje de un usuario en un trimestre
async function fetchResultados(trimestreId, usuarioId) {
  const [rows] = await db.execute(`
    SELECT ra.id_r_a,
           ra.numeros_r_a      AS numero_ra,
           uc.evaluado
      FROM r_a ra
      JOIN competencia c
        ON ra.competencia_id = c.id_competencia
      JOIN usuario_has_competencia uc
        ON uc.competencia_id = c.id_competencia
       AND uc.usuario_id     = ?
     WHERE c.trimestre_id   = ?
  `, [usuarioId, trimestreId]);
  return rows;
}

// 4) Envío de correo
async function sendMail(to, subject, text) {
  await transporter.sendMail({
    from: `"ACEF" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}

// 5) Lógica principal
async function processAlerts() {
  const instructores = await fetchInstructores();

  // — alertas inicio/fin hoy
  const hoyTrims = await fetchTrimestresByOffset();
  for (const t of hoyTrims) {
    const hoy     = format(new Date(), 'yyyy-MM-dd');
    const isStart = format(t.fecha_inicio, 'yyyy-MM-dd') === hoy;
    const tipo    = isStart ? 'Inicio' : 'Fin';

    for (const u of instructores) {
      const ras = await fetchResultados(t.id_trimestre, u.id_usuario);
      if (!ras.length) continue;

      let body = `Hola ${u.nombre} ${u.apellido},\n\n`;
      body += `${tipo} de trimestre: ${format(
        isStart ? t.fecha_inicio : t.fecha_fin,
        'dd/MM/yyyy'
      )}.\n\nResultados de aprendizaje:\n`;
      ras.forEach(r => {
        body += `• RA #${r.numero_ra} – ${
          r.evaluado ? 'Calificado ✔' : 'Pendiente ❌'
        }\n`;
      });
      if (ras.every(r => r.evaluado)) {
        body += `\n✅ ¡Has completado la calificación de todos tus RAs!`;
      }

      await sendMail(
        u.correo,
        `Alerta ACEF: ${tipo} de Trimestre`,
        body
      );
    }
  }

  // — alerta 7 días antes de fin
  const pre7 = await fetchTrimestresByOffset(7);
  for (const t of pre7) {
    for (const u of instructores) {
      const ras = await fetchResultados(t.id_trimestre, u.id_usuario);
      if (!ras.length) continue;

      let body = `Hola ${u.nombre} ${u.apellido},\n\n`;
      body += `⏳ Faltan 7 días para fin de trimestre: ${format(
        t.fecha_fin,
        'dd/MM/yyyy'
      )}.\n\nResultados de aprendizaje:\n`;
      ras.forEach(r => {
        body += `• RA #${r.numero_ra} – ${
          r.evaluado ? 'Calificado ✔' : 'Pendiente ❌'
        }\n`;
      });

      await sendMail(
        u.correo,
        'Alerta ACEF: 7 días para fin de trimestre',
        body
      );
    }
  }
}

// Cron diario a las 08:00 AM Bogotá
cron.schedule(
  '0 8 * * *',
  () => {
    console.log('[AlertService] Ejecutando comprobación –', new Date());
    processAlerts().catch(err => console.error('[AlertService ERROR]', err));
  },
  { timezone: 'America/Bogota' }
);

module.exports = { processAlerts };
