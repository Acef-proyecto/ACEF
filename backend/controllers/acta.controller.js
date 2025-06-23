// controllers/actaController.js
const db = require('../config/db');
const transporter = require('../config/mail'); // asegúrate de tener esto configurado (nodemailer)

// Subir un acta
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

// Compartir acta con otro instructor
exports.compartirActa = async (req, res) => {
  const { id_acta, correo_destino } = req.body;
  const id_usuario = req.usuario?.id; // se espera que el middleware de auth agregue esto

  if (!id_acta || !correo_destino) {
    return res.status(400).json({ mensaje: "Faltan datos necesarios (id_acta o correo_destino)." });
  }

  try {
    // Verificar que el acta exista
    const [acta] = await db.query("SELECT * FROM acta WHERE id = ?", [id_acta]);
    if (acta.length === 0) {
      return res.status(404).json({ mensaje: "El acta no existe." });
    }

    // Enviar correo al instructor destinatario
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: correo_destino,
      subject: 'Acta compartida para firma',
      html: `
        <p>Un instructor ha compartido contigo un acta para revisión y firma.</p>
        <p><strong>ID del acta:</strong> ${id_acta}</p>
        <p>Ingresa al sistema para revisarla.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Guardar en tabla de registro de compartidas
    await db.query(
      "INSERT INTO actas_compartidas (id_acta, correo_destino, compartido_por) VALUES (?, ?, ?)",
      [id_acta, correo_destino, id_usuario]
    );

    res.status(200).json({ mensaje: "Acta compartida exitosamente." });
  } catch (error) {
    console.error("❌ Error al compartir el acta:", error);
    res.status(500).json({ mensaje: "Error al compartir el acta." });
  }
};
