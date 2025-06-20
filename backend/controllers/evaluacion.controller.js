// fromProyecto/backend/controllers/evaluacion.controller.js
const db = require("../config/db");

const obtenerEstadoCompetencia = (req, res) => {
  const { fichaId, competenciaId } = req.query;

  if (!fichaId || !competenciaId) {
    return res
      .status(400)
      .json({ error: "Faltan parámetros: fichaId y/o competenciaId" });
  }

  const sql = `
    SELECT 
      a.id_aprendiz                 AS aprendiz_id,
      a.nombre                      AS nombre_aprendiz,
      c.id_competencia              AS competencia_id,
      c.nombre                      AS nombre_competencia,
      CASE 
        WHEN ahc.evaluado = 1 THEN 'Evaluado'
        ELSE 'No Evaluado'
      END                            AS estado_evaluacion
    FROM aprendiz AS a
    JOIN competencia AS c
      ON c.id_competencia = ?
    LEFT JOIN aprendiz_has_competencia AS ahc
      ON ahc.aprendiz_id = a.id_aprendiz
     AND ahc.competencia_id = c.id_competencia
    WHERE a.ficha_id = ?
    ORDER BY a.nombre;
  `;

  db.query(sql, [competenciaId, fichaId], (err, rows) => {
    if (err) {
      console.error("Error al obtener estado de competencia:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    return res.json(rows);
  });
};

module.exports = { obtenerEstadoCompetencia };
