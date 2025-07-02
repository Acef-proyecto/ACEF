const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const transporter = require("./config/mail");

dotenv.config();

const app = express();

// ── Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// ── Asegurar directorio de firmas
const firmaDir = path.join(__dirname, "uploads/firmas");
if (!fs.existsSync(firmaDir)) fs.mkdirSync(firmaDir, { recursive: true });

// ── Rutas existentes
const authRoutes = require("./routes/auth.routes");
const actaRoutes = require("./routes/acta.routes");
const busquedaRoutes = require("./routes/busqueda.routes");
const firmaRoutes = require("./routes/firma.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const alertaRoutes = require("./routes/alerta.routes");
const asignacionRoutes = require("./routes/asignacion.routes");
const trimestreRoutes = require("./routes/trimestre.routes");
const { swaggerUi, specs } = require('./swagger');
const competenciaRoutes = require("./routes/competencia.routes");
const resultadoRoutes = require("./routes/r_a.routes");

// ── Montar rutas
app.use("/api/auth", authRoutes);
app.use("/api/acta", actaRoutes);
app.use("/api/busqueda", busquedaRoutes); 
app.use("/api/firma", firmaRoutes);
app.use("/api/usuario", usuarioRoutes);
app.use("/api/alertas", alertaRoutes);  // Ruta para alertas
app.use("/api/asignacion", asignacionRoutes);
app.use("/api/trimestre", trimestreRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)); // Swagger UI
app.use("/api/competencias", competenciaRoutes);
app.use("/api/resultados", resultadoRoutes);

// ── Página de reseteo contraseña
app.get("/reset-password/:token", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "frontend", "public", "forgot-password.html"))
);

// ── Servir cliente y recursos estáticos desde la carpeta 'frontend/public'
app.use("/src", express.static(path.join(__dirname, "..", "frontend", "src")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "..", "frontend", "public")));  // Ruta pública para recursos estáticos

app.use(
  "/scripts.js",
  express.static(path.join(__dirname, "..", "src", "scripts", "scripts.js"))
);

// ── Página de inicio
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "frontend", "public", "ActasSena.html"))
);

// ── Servicio de alertas manual
const { processAlerts } = require("./services/alertService");
app.get("/api/test-alerts", async (req, res) => {
  try {
    await processAlerts();
    res.status(200).json({ ok: true, message: "Alertas ejecutadas manualmente" });
  } catch (err) {
    console.error("[/api/test-alerts]", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Test correo SMTP
app.post("/api/send-test-email", async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    await transporter.sendMail({
      from: `"ACEF" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    res.json({ ok: true, message: "Correo de prueba enviado" });
  } catch (err) {
    console.error("[/api/send-test-email]", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Validar conexión a BD
if (process.env.NODE_ENV !== 'test') {
  const db = require("./config/db");
  db.getConnection()
    .then(conn => {
      console.log("✅ Base de datos conectada correctamente.");
      conn.release();
    })
    .catch(err => {
      console.error("❌ Error al conectar a la base de datos:", err);
      process.exit(1);
    });
}

// ── Levantar servidor solo en entornos que no sean de prueba
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  );
}

module.exports = app;  // Exportamos `app` para su uso en pruebas
