import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../styles/coordinacion/asignar.css";

const Asignar = ({ visible, onClose, onAsignar, token, usuarioId }) => {
  const [competencias, setCompetencias] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [competenciaSeleccionada, setCompetenciaSeleccionada] = useState('');
  const [resultadoSeleccionado, setResultadoSeleccionado] = useState('');

  useEffect(() => {
    if (visible) {
      axios.get('/api/competencias', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setCompetencias(res.data))
      .catch(err => console.error('Error al cargar competencias', err));
    }
  }, [visible]);

  useEffect(() => {
    if (competenciaSeleccionada) {
      axios.get(`/api/usuario/resultados/${competenciaSeleccionada}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setResultados(res.data))
      .catch(err => console.error('Error al cargar resultados', err));
    } else {
      setResultados([]);
    }
  }, [competenciaSeleccionada]);

  const handleAsignar = () => {
    if (!resultadoSeleccionado) return alert('Seleccione un resultado');

    axios.post('/api/usuario/r_a', {
      usuario_id: usuarioId,
      r_a_id: resultadoSeleccionado
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      alert(res.data.mensaje);
      onAsignar(); // acción del padre (por ejemplo, cerrar modal o recargar lista)
    })
    .catch(err => {
      console.error('Error al asignar RA', err);
      alert('Error al asignar RA');
    });
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <p><strong><em>Seleccione los Resultados de Aprendizaje que el instructor va a calificar</em></strong></p>
        
        <div className="modal-content">
          <label className="modal-label">Competencia</label>
          <select className="modal-input" value={competenciaSeleccionada} onChange={(e) => setCompetenciaSeleccionada(e.target.value)}>
            <option value="">Seleccione una competencia</option>
            {competencias.map(c => (
              <option key={c.id_competencia} value={c.id_competencia}>{c.descripcion}</option>
            ))}
          </select>
        </div>

        <div className="modal-content">
          <label className="modal-label">Resultado de Aprendizaje</label>
          <select className="modal-input" value={resultadoSeleccionado} onChange={(e) => setResultadoSeleccionado(e.target.value)} disabled={!competenciaSeleccionada}>
            <option value="">Seleccione un resultado</option>
            {resultados.map(r => (
              <option key={r.id_r_a} value={r.id_r_a}>{r.descripcion}</option>
            ))}
          </select>
        </div>

        <div className="modal-buttons">
          <button className="modal-button" onClick={handleAsignar}>Asignar</button>
          <button className="modal-button cancel" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default Asignar;
