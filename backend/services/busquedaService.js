// backend/services/busquedaService.js
const connection = require('../config/db');

// Buscar fichas y programas
exports.buscarFichaPrograma = (req, res) => {
  const { ficha, programa } = req.query;

  let query = `
    SELECT 
      f.numero AS ficha,
      p.nombre AS programa
    FROM ficha f
    INNER JOIN programa p ON f.id_programa = p.id_programa
    WHERE 1=1
  `;
  const params = [];

  if (ficha) {
    query += ' AND f.numero = ?';
    params.push(ficha);
  }

  if (programa) {
    query += ' AND p.nombre LIKE ?';
    params.push(`%${programa}%`);
  }

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Error en la consulta de fichas/programas:', err);
      return res.status(500).json({ error: 'Error en la consulta' });
    }

    res.json(results);
  });
};
