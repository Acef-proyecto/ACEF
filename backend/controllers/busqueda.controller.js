// backend/controllers/busqueda.controller.js
const connection = require('../config/db');

// 1️⃣ Obtener competencias según ficha y programa
exports.getCompetencias = (req, res) => {
  const { ficha, programa } = req.query;
  if (!ficha || !programa) {
    return res.status(400).json({ error: 'Ficha y programa son obligatorios' });
  }

  const sql = `
    SELECT DISTINCT c.id_competencia, c.nombre
    FROM competencia c
    JOIN aprendiz_has_competencia ahc 
      ON ahc.competencia_id = c.id_competencia
    JOIN aprendiz a 
      ON a.id_aprendiz = ahc.aprendiz_id
    JOIN ficha f 
      ON f.id_ficha = a.ficha_id
    JOIN programa p 
      ON p.id_programa = f.id_programa
    WHERE f.numero = ? 
      AND p.nombre LIKE ?
  `;
  
  connection.query(sql, [ficha, `%${programa}%`], (err, rows) => {
    if (err) {
      console.error('Error al cargar competencias:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// 2️⃣ Obtener resultados de aprendizaje según competencia
exports.getResultados = (req, res) => {
  const { competenciaId } = req.query;
  if (!competenciaId) {
    return res.status(400).json({ error: 'Debe proporcionar competenciaId' });
  }

  const sql = `
    SELECT ra.id_r_a, ra.numeros_r_a
    FROM r_a ra
    WHERE ra.competencia_id = ?
  `;
  connection.query(sql, [competenciaId], (err, rows) => {
    if (err) {
      console.error('Error al cargar resultados de aprendizaje:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// 3️⃣ Obtener aprendices según todos los filtros
exports.getAprendices = (req, res) => {
  const { ficha, programa, competenciaId, resultadoId } = req.query;
  if (!ficha || !programa || !competenciaId || !resultadoId) {
    return res.status(400).json({ error: 'Faltan filtros requeridos' });
  }

  const sql = `
    SELECT a.id_aprendiz, a.nombre,
           IF(ahc.evaluado IS NULL, 0, ahc.evaluado) AS evaluado
    FROM aprendiz a
    JOIN ficha f 
      ON a.ficha_id = f.id_ficha
    JOIN programa p 
      ON p.id_programa = f.id_programa
    LEFT JOIN aprendiz_has_competencia ahc
      ON ahc.aprendiz_id = a.id_aprendiz
     AND ahc.competencia_id = ?
     AND ahc.resultado_id = ?
    WHERE f.numero = ? 
      AND p.nombre LIKE ?
  `;

  connection.query(
    sql,
    [competenciaId, resultadoId, ficha, `%${programa}%`],
    (err, rows) => {
      if (err) {
        console.error('Error al cargar aprendices:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};
