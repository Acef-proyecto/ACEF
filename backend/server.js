const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

// ── Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ── Asegurar que el directorio de firmas exista
const firmaDir = path.join(__dirname, "uploads/firmas");
if (!fs.existsSync(firmaDir)) {
  fs.mkdirSync(firmaDir, { recursive: true });
}

// ── Importar rutas
const authRoutes       = require("./routes/auth.routes");
const actaRoutes       = require("./routes/acta.routes");
const busquedaRoutes   = require("./routes/busqueda.routes");
const evaluacionRoutes = require("./routes/evaluacion.routes");
const firmaRoutes      = require("./routes/firma.routes");
const usuarioRoutes    = require("./routes/usuario.routes");

// ── Montar rutas de API
app.use("/api/auth",    authRoutes);
app.use("/api/acta",    actaRoutes);
app.use("/api",         busquedaRoutes);
app.use("/api",         evaluacionRoutes);
app.use("/api/firma",   firmaRoutes);
app.use("/api/usuario", usuarioRoutes);

// ── Ruta para formulario de reseteo
app.get("/reset-password/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// ── Servir recursos de /src (scripts, estilos, componentes)
app.use("/src", express.static(path.join(__dirname, "..", "src")));

// ── Servir scripts personalizados referenciados desde client
app.use("/scripts.js", express.static(path.join(__dirname, "..", "src", "scripts", "scripts.js")));

// ── Servir archivos estáticos del cliente
app.use(express.static(path.join(__dirname, "..", "client")));

// ── Servir archivos subidos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Página de inicio por defecto
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "ActasSena.html"));
});

// ── Servicio de alertas
const { processAlerts } = require("./services/alertService");

// Endpoint de prueba para alertas manuales
app.get("/api/test-alerts", async (req, res) => {
  try {
    await processAlerts();
    res.status(200).json({ ok: true, message: "Alertas ejecutadas manualmente" });
  } catch (error) {
    console.error("[/api/test-alerts]", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ── Probar conexión a base de datos al inicio (sin bloquear)
const db = require("./config/db");
db.getConnection()
  .then((conn) => {
    console.log("✅ Conexión a la base de datos establecida correctamente.");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Error al conectar a la base de datos:", err);
    process.exit(1);
  });

// ── Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
