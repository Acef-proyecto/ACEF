const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("🛂 Header recibido:", authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificamos el token
    const decoded = jwt.verify(token, jwtConfig.secret);
    console.log("🛂 Token decodificado:", decoded); // Log adicional para verificar el token

    req.usuario = decoded; // Guarda la información útil en la request
    next(); // Continua con la ejecución de la ruta
  } catch (error) {
    console.error("❌ Error al verificar el token:", error); // Log del error para depuración
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};
