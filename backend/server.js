const express     = require("express");
const cors        = require("cors");
const dotenv      = require("dotenv");
const path        = require("path");
const fs          = require("fs");
const transporter = require("./config/mail");

dotenv.config();

const app = express();

// ── Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// ── Asegurar directorios de almacenamiento
const firmaDir = path.join(__dirname, "uploads/firmas");
if (!fs.existsSync(firmaDir)) fs.mkdirSync(firmaDir, { recursive: true });

const actaDir = path.join(__dirname, "uploads/actas");
if (!fs.existsSync(actaDir)) fs.mkdirSync(actaDir, { recursive: true });

// ── Rutas
const authRoutes         = require("./routes/auth.routes");
const actaRoutes         = require("./routes/acta.routes");
const busquedaRoutes     = require("./routes/busqueda.routes");
const firmaRoutes        = require("./routes/firma.routes");
const usuarioRoutes      = require("./routes/usuario.routes");
const alertaRoutes       = require('./routes/alerta.routes');
const asignacionRoutes   = require('./routes/asignacion.routes');
const trimestreRoutes    = require('./routes/trimestre.routes');
const competenciasRoutes = require('./routes/competencia.routes');
const resultadosRoutes   = require('./routes/resultados.routes');
const fichaRoutes = require('./routes/ficha.routes');

// ── Montar rutas
app.use("/api/auth",         authRoutes);
app.use("/api/acta",         actaRoutes);
app.use("/api/busqueda",     busquedaRoutes);
app.use("/api/firma",        firmaRoutes);
app.use("/api/usuario",      usuarioRoutes);
app.use("/api/alertas",      alertaRoutes);
app.use("/api/asignacion",   asignacionRoutes);
app.use("/api/trimestre",    trimestreRoutes);
app.use("/api/competencias", competenciasRoutes);
app.use("/api/resultados",   resultadosRoutes);
app.use('/api/ficha', fichaRoutes);

// ── Servir cliente y archivos públicos
app.use("/src", express.static(path.join(__dirname, "..", "src")));

app.use(
  "/scripts.js",
  express.static(path.join(__dirname, "..", "src", "scripts", "scripts.js"))
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "..", "public"))); // Para HTML y recursos estáticos

// ── Página principal
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "public", "ActasSena.html"))
);

// ── Ruta para recuperación de contraseña
app.get("/reset-password/:token", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "public", "forgot-password.html"))
);

// ── Servicio de alertas (manual o por cron)
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

// ── Probar correo SMTP
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

// ── Validar conexión a la base de datos al iniciar
const db = require("./config/db");
db.getConnection()
  .then(conn => {
    console.log("✅ Base de datos conectada correctamente.");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Error de conexión a la base de datos:", err);
    process.exit(1);
  });

// ── Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
