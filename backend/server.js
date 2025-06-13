const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// ── Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true, // Cambiar por dominio real en producción
    credentials: true,
  })
);

// ── Importar rutas
const authRoutes = require("./routes/authRoutes");
const actaRoutes = require("./routes/actaRoutes");
const busquedaRoutes = require("./routes/busquedaRoutes");
const evaluacionRoutes = require("./routes/evaluacionRoutes");

// ── Ruta para formulario de reseteo de contraseña
app.get("/reset-password/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// ── Montar rutas de API
app.use("/api/auth", authRoutes);

// Cambiado: ahora actas queda en /api/acta/*
app.use("/api/acta", actaRoutes);

app.use("/api", busquedaRoutes);
app.use("/api", evaluacionRoutes);

// ── Servir archivos subidos (PDFs, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Servir archivos estáticos de la carpeta "client"
app.use(express.static(path.join(__dirname, "client")));

// ── Página de inicio: abrir ActasSena.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/ActasSena.html"));
});

// ── Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log("UPLOADTHING_SECRET cargado?", !!process.env.UPLOADTHING_SECRET);
  console.log("UPLOADTHING_APP_ID cargado?", !!process.env.UPLOADTHING_APP_ID);
});
