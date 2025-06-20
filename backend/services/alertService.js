// fromProyecto/backend/services/alertService.js

const cron        = require('node-cron');
const transporter = require('../config/mail');
const db          = require('../config/db');
const { format }  = require('date-fns');

// Obtener trimestres según fecha actual o días antes de terminar
async function fetchTrimestresByOffset(daysOffset = null) {
  const where = daysOffset === null
    ? `DATE(fecha_inicio) = CURDATE() OR DATE(fecha_fin) = CURDATE()`
    : `DATE(fecha_fin) = DATE_ADD(CURDATE(), INTERVAL ${daysOffset} DAY)`;
  const [rows] = await db.query(`SELECT * FROM trimestre WHERE ${where}`);
  return rows;
}

// Obtener sólo usuarios instructores activos
async function fetchInstructores() {
  const [rows] = await db.query(`
    SELECT id_usuario, nombre, apellido, correo
    FROM usuario
    WHERE rol = 'instructor' AND estado = 'activo'
  `);
  return rows;
}

// Obtener resultados de aprendizaje asociados a un usuario y trimestre
async function fetchResultados(trimestreId, usuarioId) {
  const [ras] = await db.query(`
    SELECT ra.id_r_a,
           ra.nombre         AS nombre_ra,
           uc.evaluado
      FROM r_a ra
      JOIN competencia c ON ra.competencia_id = c.id_competencia
      JOIN usuario_has_competencia uc
        ON uc.competencia_id = c.id_competencia
       AND uc.usuario_id = ?
     WHERE c.trimestre_id = ?
  `, [usuarioId, trimestreId]);
  return ras;
}

// Enviar correo usando transporter configurado
async function sendMail(to, subject, text) {
  await transporter.sendMail({
    from: `"ACEF" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}

// Procesar todas las alertas necesarias
async function processAlerts() {
  // Sólo instructores
  const instructores = await fetchInstructores();

  // 1. Alertas por fecha de inicio o fin = hoy
  const hoyTrims = await fetchTrimestresByOffset();
  for (const t of hoyTrims) {
    const hoy = new Date().toISOString().slice(0, 10);
    const esInicio = t.fecha_inicio.toISOString().slice(0, 10) === hoy;
    const tipo = esInicio ? 'Inicio' : 'Fin';

    for (const u of instructores) {
      const ras = await fetchResultados(t.id_trimestre, u.id_usuario);
      if (ras.length === 0) continue;

      let body = `Hola ${u.nombre} ${u.apellido},\n\n`;
      body += `${tipo} de trimestre el ${format(
        esInicio ? t.fecha_inicio : t.fecha_fin,
        'dd/MM/yyyy'
      )}.\n\n`;
      body += `Resultados de aprendizaje:\n`;

      ras.forEach(r => {
        body += `• RA: ${r.nombre_ra} – ${
          r.evaluado ? 'Calificado ✔' : 'Pendiente ❌'
        }\n`;
      });

      if (ras.every(r => r.evaluado)) {
        body += `\n✅ ¡Has completado la calificación de todos tus resultados de aprendizaje!`;
      }

      await sendMail(
        u.correo,
        `Alerta ACEF: ${tipo} de Trimestre`,
        body
      );
    }
  }

  // 2. Alerta 7 días antes de fin de trimestre
  const pre7 = await fetchTrimestresByOffset(7);
  for (const t of pre7) {
    for (const u of instructores) {
      const ras = await fetchResultados(t.id_trimestre, u.id_usuario);
      if (ras.length === 0) continue;

      let body = `Hola ${u.nombre} ${u.apellido},\n\n`;
      body += `⏳ Faltan 7 días para finalizar el trimestre el ${format(
        t.fecha_fin,
        'dd/MM/yyyy'
      )}.\n\n`;
      body += `Resultados de aprendizaje:\n`;

      ras.forEach(r => {
        body += `• RA: ${r.nombre_ra} – ${
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

// Ejecutar todos los días a las 08:00 AM hora Bogotá
cron.schedule(
  '0 8 * * *',
  () => {
    console.log(
      '[AlertService] Iniciando comprobación de alertas –',
      new Date().toISOString()
    );
    processAlerts().catch(err => console.error('[AlertService ERROR]', err));
  },
  { timezone: 'America/Bogota' }
);

// Exportar para pruebas manuales
module.exports = { processAlerts };
