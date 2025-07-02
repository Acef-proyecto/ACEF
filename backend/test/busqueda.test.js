const request = require('supertest');
const app = require('../server.js');
const connection = require('../config/db');
const cron = require('node-cron');

// Mock de connection.query para simular las consultas de base de datos
jest.mock('../config/db', () => ({
  query: jest.fn(),  // Mock de query
}));

// Aumentar el tiempo de espera globalmente para todas las pruebas
jest.setTimeout(60000); // Aumenta el timeout a 60 segundos para evitar que se agoten

// Mock de console.error para suprimir los errores en consola durante las pruebas
beforeAll(() => {
  console.error = jest.fn();
});

// Detener cron job después de los tests
let cronJob;

afterAll(() => {
  if (cronJob) {
    cronJob.stop();  // Detenemos el cron job utilizando la referencia
  }
});

describe('Busqueda Endpoints', () => {
  describe('GET /api/busqueda/buscar', () => {
    it('debería devolver resultados cuando se proporcionan ficha y programa', async () => {
      const mockResults = [
        { ficha: '12345', programa: 'Program A' },
        { ficha: '67890', programa: 'Program B' }
      ];

      // Simulando la consulta a la base de datos utilizando la promesa
      connection.query.mockImplementation((query, params, callback) => {
        // Simulamos que la consulta es exitosa
        callback(null, mockResults);
      });

      const res = await request(app)
        .get('/api/busqueda/buscar')
        .query({ ficha: '12345', programa: 'Program A' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockResults);
    });

    it('debería devolver error 500 cuando ocurre un error en la base de datos', async () => {
      // Simulando un error en la consulta de la base de datos
      connection.query.mockImplementation((query, params, callback) => {
        // Simulamos un error de base de datos
        callback(new Error('Database Error'), null);
      });

      const res = await request(app)
        .get('/api/busqueda/buscar')
        .query({ ficha: '12345', programa: 'Program A' });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'Error en la consulta');
    });
  });

  describe('GET /api/busqueda/competencias', () => {
    it('debería devolver competencias para una ficha y un programa', async () => {
      const mockCompetencias = [
        { id_competencia: 1, nombre: 'Competencia 1' },
        { id_competencia: 2, nombre: 'Competencia 2' }
      ];

      connection.query.mockImplementation((query, params, callback) => {
        callback(null, mockCompetencias);  // Simulando una consulta exitosa
      });

      const res = await request(app)
        .get('/api/busqueda/competencias')
        .query({ ficha: '12345', programa: 'Program A' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockCompetencias);
    });
  });

  describe('GET /api/busqueda/resultados', () => {
    it('debería devolver los resultados de aprendizaje según la competencia', async () => {
      const mockResultados = [
        { id_r_a: 1, numeros_r_a: 'RA001', descripcion: 'Resultado 1' },
        { id_r_a: 2, numeros_r_a: 'RA002', descripcion: 'Resultado 2' }
      ];

      connection.query.mockImplementation((query, params, callback) => {
        callback(null, mockResultados);
      });

      const res = await request(app)
        .get('/api/busqueda/resultados')
        .query({ competenciaId: '1' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockResultados);
    });
  });

  describe('GET /api/busqueda/aprendices', () => {
    it('debería devolver aprendices filtrados por ficha, programa, competencia y resultado', async () => {
      const mockAprendices = [
        { id_aprendiz: 1, nombre: 'Juan Perez', evaluado: 1 },
        { id_aprendiz: 2, nombre: 'Maria Lopez', evaluado: 0 }
      ];

      connection.query.mockImplementation((query, params, callback) => {
        callback(null, mockAprendices);
      });

      const res = await request(app)
        .get('/api/busqueda/aprendices')
        .query({
          ficha: '12345',
          programa: 'Program A',
          competenciaId: '1',
          resultadoId: '1'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockAprendices);
    });
  });
});
