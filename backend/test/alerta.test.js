const request = require('supertest');
const app = require('../server.js');
const { setupTestDB, cleanupTestDB } = require('./testConfig');
const nodemailer = require('nodemailer');  // Asegúrate de importar el mock de nodemailer
const mailer = require('../config/mail');  // Importa la configuración del mailer
jest.mock('../config/mail');  // Mock de mailer

// Crear el mock de sendMail
const sendMailMock = jest.fn().mockResolvedValue('Mail sent successfully');
mailer.sendMail = sendMailMock;  // Sobrescribir la implementación del método sendMail

const server = app.listen(0);  // Evitar que el servidor se inicie cuando se ejecuten los tests

describe('Alerta Endpoints', () => {
  let connection;

  // Configurar la base de datos antes de los tests
  beforeAll(async () => {
    connection = await setupTestDB();
  });

  // Limpiar la base de datos después de los tests
  afterAll(async () => {
    await cleanupTestDB(connection);
    await new Promise(resolve => server.close(resolve));  // Cerramos el servidor después de los tests
  });

  // Test para la creación de alerta
  describe('POST /api/alertas/trimestre', () => {
    it('debería enviar alerta correctamente con correo de instructor', async () => {
      const res = await request(app)
        .post('/api/alertas/trimestre')  // Asegúrate de que esta sea la ruta correcta
        .send({
          mensaje: 'Alerta trimestral de prueba',
          correo_instructor: 'instructor@example.com',
          fecha_inicio: '2025-01-01',
          fecha_fin: '2025-03-31'
        });

      // Verificar que la respuesta sea 201 (creado) y que se haya llamado a sendMail
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('ok', true);
      expect(sendMailMock).toHaveBeenCalled();  // Verificar que sendMail fue llamado
    });

    it('debería fallar si faltan fechas obligatorias', async () => {
      const res = await request(app)
        .post('/api/alertas/trimestre')  // Asegúrate de que esta sea la ruta correcta
        .send({
          mensaje: 'Alerta trimestral de prueba'
        });

      // Verificar que la respuesta sea 400 y que el mensaje de error sea correcto
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Las fechas y el mensaje son obligatorios');
    });

    it('debería fallar si no se proporciona mensaje', async () => {
      const res = await request(app)
        .post('/api/alertas/trimestre')  // Asegúrate de que esta sea la ruta correcta
        .send({
          correo_instructor: 'instructor@example.com',
          fecha_inicio: '2025-01-01',
          fecha_fin: '2025-03-31'
        });

      // Verificar que la respuesta es 400 cuando falta el mensaje
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Las fechas y el mensaje son obligatorios');
    });
  });
});
