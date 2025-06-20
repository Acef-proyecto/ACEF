const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');
const nodemailer = require('nodemailer');
const db = require('../config/db');
require('dotenv').config();

// Registro
const registrar = async (req, res) => {
  const { Nombre, Apellido, Correo, Contraseña, rol, contacto } = req.body;

  if (!Nombre || !Apellido || !Correo || !Contraseña || !rol || !contacto) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  Usuario.buscarPorCorreo(Correo, async (err, resultados) => {
    if (err) return res.status(500).json({ mensaje: 'Error al buscar el correo' });

    if (resultados.length > 0) {
      return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    }

    try {
      const hashedPassword = await bcrypt.hash(Contraseña, 10);

      const nuevoUsuario = {
        Nombre,
        Apellido,
        Correo,
        Password: hashedPassword,
        rol,
        contacto
        // firma: null // no se registra al inicio
      };

      Usuario.crear(nuevoUsuario, (err) => {
        if (err) {
          console.error('Error al insertar usuario:', err);
          return res.status(500).json({ mensaje: 'Error al registrar usuario' });
        }
        res.status(201).json({ mensaje: 'Registro exitoso' });
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al encriptar la contraseña' });
    }
  });
};

// Login
const login = (req, res) => {
  const { Correo, Contraseña } = req.body;

  if (!Correo || !Contraseña) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
  }

  Usuario.buscarPorCorreo(Correo, async (err, resultados) => {
    if (err) return res.status(500).json({ mensaje: 'Error al buscar el usuario' });

    if (resultados.length === 0) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const usuario = resultados[0];
    const passwordValida = await bcrypt.compare(Contraseña, usuario.Password);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign({
      id: usuario.id_usuario,
      nombre: usuario.nombre
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        contacto: usuario.contacto,
        firma: usuario.firma || null
      }
    });
  });
};

// Enviar correo para restablecer contraseña
const forgotPassword = async (req, res) => {
  const { correo } = req.body;

  Usuario.buscarPorCorreo(correo, async (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Correo no encontrado' });
    }

    const user = results[0];
    const token = jwt.sign({ id: user.id_usuario, correo: user.correo }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    await transporter.sendMail({
      from: '"Soporte" <soporte@tuapp.com>',
      to: correo,
      subject: "Restablecer contraseña",
      html: `<p>Haz clic en este enlace para cambiar tu contraseña:</p><a href="${resetLink}">${resetLink}</a>`
    });

    res.json({ message: 'Correo enviado con éxito' });
  });
};

// Restablecer contraseña con token
const resetPassword = (req, res) => {
  const { token } = req.params;
  const { nuevaPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const correo = decoded.correo;

    bcrypt.hash(nuevaPassword, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: 'Error al encriptar la contraseña' });

      db.query('UPDATE usuario SET Password = ? WHERE correo = ?', [hash, correo], (error) => {
        if (error) return res.status(500).json({ error: 'Error al actualizar contraseña' });

        res.json({ message: 'Contraseña actualizada correctamente' });
      });
    });
  } catch (error) {
    return res.status(400).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = {
  registrar,
  login,
  forgotPassword,
  resetPassword
};
