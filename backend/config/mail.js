// backend/config/mail.js

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT, 10),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verificar configuración SMTP al arrancar
transporter.verify((err, success) => {
  if (err) {
    console.error('[Mail Config ERROR]', err);
  } else {
    console.log('[Mail Config OK] SMTP ready to send messages');
  }
});

module.exports = transporter;
