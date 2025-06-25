const connection = require('../config/db');

// 1️⃣ Buscar ficha y programa (nueva función para /buscar)
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
      console.error('Error en la consulta:', err);
      return res.status(500).json({ error: 'Error en la consulta' });
    }

    res.json(results);
  });
};

// 2️⃣ Obtener competencias según ficha y programa
exports.getCompetencias = (req, res) => {
  const { ficha, programa } = req.query;
  if (!ficha || !programa) {
    return res.status(400).json({ error: 'Ficha y programa son obligatorios' });
  }

  const sql = `
    SELECT DISTINCT c.id_competencia, c.nombre
    FROM ficha f
    JOIN programa p ON p.id_programa = f.id_programa
    JOIN ficha_has_competencia fc ON fc.ficha_id = f.id_ficha
    JOIN competencia c ON c.id_competencia = fc.competencia_id
    WHERE f.numero = ? AND p.nombre LIKE ?
  `;

  connection.query(sql, [ficha, `%${programa}%`], (err, rows) => {
    if (err) {
      console.error('Error al cargar competencias:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// 3️⃣ Obtener resultados de aprendizaje según competencia
exports.getResultados = (req, res) => {
  const { competenciaId } = req.query;
  if (!competenciaId) {
    return res.status(400).json({ error: 'Debe proporcionar competenciaId' });
  }

  const sql = `
    SELECT ra.id_r_a, ra.numeros_r_a, ra.descripcion
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

// 4️⃣ Obtener aprendices filtrados y su estado de evaluación por RA
exports.getAprendices = (req, res) => {
  const { ficha, programa, competenciaId, resultadoId } = req.query;
  if (!ficha || !programa || !competenciaId || !resultadoId) {
    return res.status(400).json({ error: 'Faltan filtros requeridos' });
  }

  const sql = `
    SELECT u.id_usuario AS id_aprendiz, CONCAT(u.nombre, ' ', u.apellido) AS nombre,
           IF(uhra.evaluado IS NULL, 0, uhra.evaluado) AS evaluado
    FROM usuario u
    JOIN usuario_has_ficha uf ON u.id_usuario = uf.usuario_id
    JOIN ficha f ON f.id_ficha = uf.ficha_id
    JOIN programa p ON p.id_programa = f.id_programa
    LEFT JOIN usuario_has_r_a uhra
      ON uhra.usuario_id = u.id_usuario
     AND uhra.r_a_id = ?
    WHERE f.numero = ?
      AND p.nombre LIKE ?
      AND u.rol = 'aprendiz'
  `;

  connection.query(
    sql,
    [resultadoId, ficha, `%${programa}%`],
    (err, rows) => {
      if (err) {
        console.error('Error al cargar aprendices:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};
