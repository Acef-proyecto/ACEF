const nodemailer = require('nodemailer');
require('dotenv').config();

// Crear el transporte con las variables de entorno
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,           // Ej. smtp.gmail.com
  port: parseInt(process.env.MAIL_PORT, 10),  // Ej. 587
  secure: process.env.MAIL_SECURE === 'true',  // true para puerto 465, false para 587
  auth: {
    user: process.env.EMAIL_USER,         // Tu email (usuario)
    pass: process.env.EMAIL_PASS,         // Tu contraseña o token de aplicación
  },
});

// Si no estamos en el entorno de pruebas, verificar la configuración SMTP
if (process.env.NODE_ENV !== 'test') {
  transporter.verify((err, success) => {
    if (err) {
      console.error('[Mail Config ERROR]', err);  // En caso de error, lo imprimimos en consola
    } else {
      console.log('[Mail Config OK] SMTP ready to send messages');  // Confirmación de conexión exitosa
    }
  });
}

module.exports = transporter;  // Exportamos el transporter para usarlo en otros archivos
