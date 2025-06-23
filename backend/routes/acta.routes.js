const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db");
const actaController = require("../controllers/acta.controller"); // ✅ importar controlador
const authMiddleware = require("../middleware/auth.middleware"); // ✅ importar middleware si lo usas

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

// 📌 Ruta base de prueba
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
router.post("/guardar", actaController.subir);

// 📌 Compartir acta con otro instructor
router.post("/compartir", authMiddleware, actaController.compartirActa);

// 📌 Nueva ruta para obtener actas compartidas al usuario autenticado
router.get("/compartidas", authMiddleware, actaController.obtenerActasCompartidas);

module.exports = router;
