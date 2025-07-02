const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../server.js');
const connection = require('../config/db');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

jest.setTimeout(60000);

describe('Acta Controller Endpoints', () => {
  let token;

  beforeAll(async () => {
    // Crear un token válido para las pruebas
    token = jwt.sign({ id_usuario: 12345 }, jwtConfig.secret, { expiresIn: '1h' });
  });

  describe('POST /api/acta/subir', () => {
    it('should successfully register an acta URL', async () => {
      const mockResult = { insertId: 42 };
      const tempDir = path.join(__dirname, 'temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
      const filePath = path.join(tempDir, 'mock-file.pdf');
      fs.writeFileSync(filePath, 'Mock file content');

      // Simular respuesta de base de datos
      connection.query.mockResolvedValueOnce([mockResult]);

      const res = await request(app)
        .post('/api/acta/subir')
        .set('Authorization', `Bearer ${token}`)
        .field('ficha_id', 1) // Usar un id válido de ficha
        .attach('archivo', filePath); // Adjuntar el archivo simulado

      console.log('Response body:', res.body);  // Log para ver la respuesta

      // Verificamos la respuesta del test
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('mensaje', 'Acta subida y asociada a ficha correctamente');
      expect(res.body).toHaveProperty('actaId', mockResult.insertId); // Verificar el ID de acta
      expect(res.body).toHaveProperty('url'); // Verificar la URL generada

      fs.unlinkSync(filePath); // Limpiar archivo simulado
    });

    it('should return error 400 if no file URL is provided', async () => {
      const res = await request(app)
        .post('/api/acta/subir')
        .set('Authorization', `Bearer ${token}`)
        .send({ ficha_id: 12345 });

      console.log('Response body (error case):', res.body);  // Log para ver el error

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('mensaje', 'PDF (archivo) y ficha_id son obligatorios');
    });
  });

  describe('POST /api/acta/compartir', () => {
    it('should share the acta successfully', async () => {
      const mockActa = [{ id_acta: 1 }];
      const mockUsuario = [{ id_usuario: 2 }];
      connection.query.mockResolvedValueOnce(mockActa)
        .mockResolvedValueOnce(mockUsuario);

      const res = await request(app)
        .post('/api/acta/compartir')
        .set('Authorization', `Bearer ${token}`)
        .send({ id_acta: 1, correo_destino: 'testuser@example.com' });

      console.log('Response body (sharing acta):', res.body);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('mensaje', 'Acta compartida exitosamente.');
    });

    it('should return error 400 if missing required data', async () => {
      const res = await request(app)
        .post('/api/acta/compartir')
        .set('Authorization', `Bearer ${token}`)
        .send({}); // Enviar solicitud vacía

      console.log('Response body (missing data):', res.body);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('mensaje', 'Faltan datos necesarios (id_acta o correo_destino).');
    });

    it('should return error 404 if acta not found', async () => {
      connection.query.mockResolvedValueOnce([]); // No se encuentra el acta

      const res = await request(app)
        .post('/api/acta/compartir')
        .set('Authorization', `Bearer ${token}`)
        .send({ id_acta: 9999, correo_destino: 'testuser@example.com' });

      console.log('Response body (acta not found):', res.body);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('mensaje', 'El acta no existe.');
    });

    it('should return error 404 if email not found', async () => {
      const mockActa = [{ id_acta: 1 }];
      connection.query.mockResolvedValueOnce(mockActa)
        .mockResolvedValueOnce([]); // Usuario no encontrado

      const res = await request(app)
        .post('/api/acta/compartir')
        .set('Authorization', `Bearer ${token}`)
        .send({ id_acta: 1, correo_destino: 'nonexistentuser@example.com' });

      console.log('Response body (email not found):', res.body);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('mensaje', 'El correo destino no pertenece a ningún usuario.');
    });
  });
});
