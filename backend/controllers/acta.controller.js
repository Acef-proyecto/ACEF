const db = require('../config/db');
const transporter = require('../config/mail'); // asegúrate de tener esto configurado (nodemailer)

// 1️⃣ Subir un acta
exports.subir = (req, res) => {
  const { anexos } = req.body;

  if (!anexos || typeof anexos !== 'string') {
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

// 2️⃣ Compartir acta con otro instructor
exports.compartirActa = async (req, res) => {
  const { id_acta, correo_destino } = req.body;
  const id_usuario = req.usuario?.id; // requiere middleware auth

  if (!id_acta || !correo_destino) {
    return res.status(400).json({ mensaje: "Faltan datos necesarios (id_acta o correo_destino)." });
  }

  try {
    // Verificar que el acta exista
    const [acta] = await db.query("SELECT * FROM acta WHERE id_acta = ?", [id_acta]);
    if (acta.length === 0) {
      return res.status(404).json({ mensaje: "El acta no existe." });
    }

    // Obtener el id del receptor a partir del correo
    const [destinatario] = await db.query("SELECT id_usuario FROM usuario WHERE correo = ?", [correo_destino]);
    if (destinatario.length === 0) {
      return res.status(404).json({ mensaje: "El correo destino no pertenece a ningún usuario." });
    }

    const receptor_id = destinatario[0].id_usuario;

    // Guardar en tabla de actas_compartidas usando receptor_id
    await db.query(
      "INSERT INTO actas_compartidas (id_acta, correo_destino, compartido_por) VALUES (?, ?, ?)",
      [id_acta, correo_destino, id_usuario]
    );

    // [Opcional] Enviar correo
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

    res.status(200).json({ mensaje: "Acta compartida exitosamente." });
  } catch (error) {
    console.error("❌ Error al compartir el acta:", error);
    res.status(500).json({ mensaje: "Error al compartir el acta." });
  }
};

// 3️⃣ Obtener actas compartidas con el usuario actual
exports.obtenerActasCompartidas = (req, res) => {
  const id_usuario = req.usuario?.id;

  if (!id_usuario) {
    return res.status(400).json({ mensaje: "ID del usuario no disponible en la sesión." });
  }

  const sql = `
    SELECT ac.id, ac.id_acta, a.anexos, ac.fecha_envio, u.nombre AS compartido_por
    FROM actas_compartidas ac
    JOIN acta a ON ac.id_acta = a.id_acta
    JOIN usuario u ON ac.compartido_por = u.id_usuario
    WHERE ac.receptor_id = ?
    ORDER BY ac.fecha_envio DESC
  `;

  db.query(sql, [id_usuario], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener actas compartidas:", err);
      return res.status(500).json({ mensaje: "Error al obtener actas compartidas." });
    }

    res.status(200).json(rows);
  });
};
