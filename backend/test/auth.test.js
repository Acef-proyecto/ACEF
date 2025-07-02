const request = require('supertest');
const app = require('../server.js');  // Asegúrate de que 'server.js' sea el archivo correcto
const { setupTestDB, cleanupTestDB } = require('./testConfig');  // Configuración de la base de datos

const server = app.listen(0);  // Evitar que el servidor se inicie cuando se ejecuten los tests

describe('Auth Endpoints', () => {
  let connection;
  let validToken;

  // Configurar la base de datos antes de los tests
  beforeAll(async () => {
    connection = await setupTestDB();

    // Generar un token válido antes de los tests de restablecimiento de contraseña
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        Correo: 'instructor@example.com',
        Contraseña: 'Password123'
      });
    validToken = loginRes.body.token;
  });

  // Limpiar la base de datos después de los tests
  afterAll(async () => {
    await cleanupTestDB(connection);
    await new Promise(resolve => server.close(resolve));  // Cerramos el servidor después de los tests
  });

  // Pruebas para el login
  describe('POST /api/auth/login', () => {
    it('debería iniciar sesión con credenciales válidas de instructor', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          Correo: 'instructor@example.com',
          Contraseña: 'Password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('usuario');
      expect(res.body.usuario).toHaveProperty('rol');
      expect(res.body.usuario.rol).toBe('instructor');
    });

    it('debería iniciar sesión con credenciales válidas de coordinador', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          Correo: 'coordinador@example.com',
          Contraseña: 'Password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('usuario');
      expect(res.body.usuario).toHaveProperty('rol');
      expect(res.body.usuario.rol).toBe('coordinador');
    });

    it('debería iniciar sesión con credenciales válidas de aprendiz', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          Correo: 'aprendiz@example.com',
          Contraseña: 'Password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('usuario');
      expect(res.body.usuario).toHaveProperty('rol');
      expect(res.body.usuario.rol).toBe('aprendiz');
    });

    it('debería fallar con credenciales inválidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          Correo: 'invalid@example.com',
          Contraseña: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('mensaje');
      expect(res.body.mensaje).toBe('Correo o contraseña incorrectos');
    });
  });

  // Pruebas para el registro de usuario
  describe('POST /api/auth/register', () => {
    it('debería registrar un usuario con credenciales válidas', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          Nombre: 'Nuevo Usuario',
          Apellido: 'Test',
          Correo: `test${Date.now()}@example.com`,
          Contraseña: 'Password123!',
          rol: 'aprendiz',
          contacto: '3011234567'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('mensaje');
      expect(res.body.mensaje).toBe('Registro exitoso');
    });

    it('debería fallar si el correo ya está registrado', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          Nombre: 'Usuario Existente',
          Apellido: 'Test',
          Correo: 'instructor@example.com',  // Correo que ya existe
          Contraseña: 'Password123!',
          rol: 'instructor',
          contacto: '3011234567'
        });

      expect(res.statusCode).toBe(409);  // Conflicto si el correo ya existe
      expect(res.body).toHaveProperty('mensaje');
      expect(res.body.mensaje).toBe('El correo ya está registrado');
    });

    it('debería fallar si faltan campos obligatorios', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          Nombre: 'Faltan Campos',  // No se envió el correo, contraseña, etc.
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('mensaje');
      expect(res.body.mensaje).toBe('Todos los campos son obligatorios');
    });
  });

  // Pruebas para el cambio de contraseña
  describe('POST /api/auth/reset-password/:token', () => {
    it('debería restablecer la contraseña con un token válido', async () => {
      const res = await request(app)
        .post(`/api/auth/reset-password/${validToken}`)  // Usar el token generado en el login
        .send({
          nuevaPassword: 'NewPassword123!'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Contraseña actualizada correctamente');
    });

    it('debería fallar con un token inválido', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password/invalid-token')
        .send({
          nuevaPassword: 'NewPassword123!'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Token inválido o expirado');
    });

    it('debería fallar si no se envía nueva contraseña', async () => {
      const res = await request(app)
        .post(`/api/auth/reset-password/${validToken}`)
        .send({});  // Sin nueva contraseña

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Nueva contraseña es requerida');
    });
  });
});
