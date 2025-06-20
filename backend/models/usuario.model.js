const db = require('../config/db');

const Usuario = {
  buscarPorCorreo: (correo, cb) =>
    db.query('SELECT * FROM usuario WHERE correo = ?', [correo], cb),

  crear: (u, cb) =>
    db.query(
      `INSERT INTO usuario (nombre, apellido, correo, Password, rol, estado, contacto)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [u.Nombre, u.Apellido, u.Correo, u.Password, u.rol || 'aprendiz', 'activo', u.contacto || ''],
      cb
    )
};

module.exports = Usuario;
