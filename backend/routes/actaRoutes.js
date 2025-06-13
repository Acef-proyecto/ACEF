const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db");

const router = express.Router();

// ── Configuración de almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // guarda en /backend/uploads
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/\s+/g, "_");
    const filename = `${timestamp}-${sanitized}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// 📌 Ruta base de prueba para evitar error de path-to-regexp
router.get("/", (req, res) => {
  res.json({ mensaje: "Rutas de actas funcionando correctamente." });
});

// 📌 Subir archivo (PDF)
router.post("/subir", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se envió archivo." });
  }

  const url = `/uploads/${req.file.filename}`;
  console.log("📥 Acta recibida:", req.file.filename);

  return res.status(200).json({
    mensaje: "Archivo recibido correctamente.",
    url,
  });
});

// 📌 Guardar la URL del archivo en la base de datos
router.post("/guardar", (req, res) => {
  const { anexos } = req.body;

  if (!anexos) {
    return res.status(400).json({ error: "Falta el campo 'anexos'." });
  }

  const sql = "INSERT INTO acta (anexos) VALUES (?)";
  db.query(sql, [anexos], (err, result) => {
    if (err) {
      console.error("❌ Error al guardar en la base de datos:", err);
      return res.status(500).json({ error: "Error en base de datos" });
    }

    console.log("✅ Acta guardada con ID:", result.insertId);
    return res.status(200).json({
      mensaje: "Acta registrada correctamente",
      id: result.insertId,
    });
  });
});

module.exports = router;
