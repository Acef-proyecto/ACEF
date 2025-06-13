// controllers/actaController.js
const db = require('../config/db');

exports.subir = (req, res) => {
  const { anexos } = req.body;

  if (!anexos || !anexos.startsWith('http')) {
    return res.status(400).json({ mensaje: 'Debes proporcionar una URL válida para el archivo.' });
  }

  const sql = 'INSERT INTO acta (anexos) VALUES (?)';

  db.query(sql, [anexos], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar la URL:', err);
      return res.status(500).json({ mensaje: 'Error al registrar la URL del archivo.' });
    }

    console.log('✅ Archivo registrado con ID:', result.insertId);
    res.status(201).json({
      mensaje: 'Archivo registrado correctamente.',
      acta_id: result.insertId
    });
  });
};
