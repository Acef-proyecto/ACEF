const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const testConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ADMIN2020',
  database: process.env.DB_NAME || 'acef',
  port: process.env.DB_PORT || 3306
};

// Función para configurar la base de datos de prueba
async function setupTestDB() {
  const connection = await mysql.createConnection(testConfig);

  try {
    // Generar hashes de contraseñas para los roles
    const aprendizPassword = await bcrypt.hash('Password123', 10);
    const instructorPassword = await bcrypt.hash('Password123', 10);
    const coordinadorPassword = await bcrypt.hash('Password123', 10);

    // Verificar si los usuarios de prueba ya existen
    const [existingUsers] = await connection.execute(
      'SELECT * FROM usuario WHERE Correo IN (?, ?, ?)',
      ['aprendiz@example.com', 'instructor@example.com', 'coordinador@example.com']
    );

    if (existingUsers.length === 0) {
      // Si no existen, los insertamos
      await connection.execute(`
        INSERT INTO usuario (Nombre, Apellido, Correo, Password, rol, contacto) 
        VALUES 
        ('Test Aprendiz', 'User', 'aprendiz@example.com', ?, 'aprendiz', '3011234567'),
        ('Test Instructor', 'User', 'instructor@example.com', ?, 'instructor', '3011234567'),
        ('Test Coordinador', 'User', 'coordinador@example.com', ?, 'coordinador', '3011234567')
      `, [aprendizPassword, instructorPassword, coordinadorPassword]);
    } else {
      // Si existen, actualizamos sus contraseñas
      await connection.execute(
        'UPDATE usuario SET Password = ? WHERE Correo = ?',
        [aprendizPassword, 'aprendiz@example.com']
      );
      await connection.execute(
        'UPDATE usuario SET Password = ? WHERE Correo = ?',
        [instructorPassword, 'instructor@example.com']
      );
      await connection.execute(
        'UPDATE usuario SET Password = ? WHERE Correo = ?',
        [coordinadorPassword, 'coordinador@example.com']
      );
    }
  } catch (error) {
    console.error('Error setting up test data:', error);
    throw error;
  }

  return connection;
}

// Función para limpiar la base de datos de prueba
async function cleanupTestDB(connection) {
  try {
    if (connection) {
      // Cierra la conexión, puedes agregar limpieza de usuarios si lo necesitas
      await connection.end();
    }
  } catch (error) {
    console.error('Error closing connection:', error);
  }
}

module.exports = {
  setupTestDB,
  cleanupTestDB
};
