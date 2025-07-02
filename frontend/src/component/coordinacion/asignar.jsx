import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../styles/coordinacion/asignar.css";
import { asignarResultado } from "../../services/asignarService";

const Asignar = ({ visible, onClose, onAsignar, token, correoInstructor }) => {
  const [usuarioId, setUsuarioId] = useState(null);
  const [competencias, setCompetencias] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [competenciaSeleccionada, setCompetenciaSeleccionada] = useState('');
  const [resultadoSeleccionado, setResultadoSeleccionado] = useState('');

  // Obtener ID del instructor a partir del correo
  useEffect(() => {
    if (visible && correoInstructor) {
      axios.get(`/api/usuario/correo/${correoInstructor}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          console.log('✅ Instructor encontrado:', res.data);
          setUsuarioId(res.data.id_usuario);
          console.log("📡 Buscando usuario por correo:", correoInstructor);
console.log("🔐 Token enviado:", token);

        })
        .catch(err => {
          console.error('❌ Error al buscar usuario por correo:', err);
          setUsuarioId(null);
          alert("No se encontró un usuario con ese correo.");
        });
    }
  }, [visible, correoInstructor, token]);

  // Cargar competencias al abrir el modal
  useEffect(() => {
    if (visible) {
      axios.get('/api/competencias', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          console.log('✅ Competencias recibidas:', res.data);
          setCompetencias(res.data);
        })
        .catch(err => {
          console.error('❌ Error al cargar competencias', err);
          setCompetencias([]);
        });
    }
  }, [visible, token]);

  // Cargar resultados según competencia seleccionada
  useEffect(() => {
    if (competenciaSeleccionada) {
      axios.get(`/api/resultados/${competenciaSeleccionada}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          console.log('✅ Resultados recibidos:', res.data);
          setResultados(res.data);
        })
        .catch(err => {
          console.error('❌ Error al cargar resultados', err);
          setResultados([]);
        });
    } else {
      setResultados([]);
    }
  }, [competenciaSeleccionada, token]);

  // Asignar resultado al instructor
  const handleAsignar = async () => {
    if (!usuarioId || !competenciaSeleccionada || !resultadoSeleccionado) {
      return alert('Faltan datos para asignar: instructor, competencia o resultado');
    }

    try {
      const respuesta = await asignarResultado({
        usuario_id: usuarioId,
        competencia_id: competenciaSeleccionada,
        r_a_id: resultadoSeleccionado,
        token
      });
      alert(respuesta.mensaje);
      onAsignar(); // cerrar modal y refrescar si es necesario
    } catch (err) {
      console.error('❌ Error al asignar RA:', err);
      alert(err.response?.data?.mensaje || err.message || 'Error al asignar resultado');
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <p><strong><em>Seleccione los Resultados de Aprendizaje que el instructor va a calificar</em></strong></p>

        {/* Selector de competencias */}
        <div className="modal-content">
          <label className="modal-label">Competencia</label>
          <select
            className="modal-input"
            value={competenciaSeleccionada}
            onChange={(e) => {
              setCompetenciaSeleccionada(e.target.value);
              setResultadoSeleccionado('');
            }}
          >
            <option value="">Seleccione una competencia</option>
            {competencias.length === 0 && (
              <option disabled>Cargando o sin resultados...</option>
            )}
            {competencias.map((c) => (
              <option key={c.id_competencia} value={c.id_competencia}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de resultados */}
        <div className="modal-content">
          <label className="modal-label">Resultado de Aprendizaje</label>
          <select
            className="modal-input"
            value={resultadoSeleccionado}
            onChange={(e) => setResultadoSeleccionado(e.target.value)}
            disabled={!competenciaSeleccionada}
          >
            <option value="">Seleccione un resultado</option>
            {competenciaSeleccionada && resultados.length === 0 && (
              <option disabled>No hay resultados para esta competencia</option>
            )}
            {resultados.map((r) => (
              <option key={r.id_r_a} value={r.id_r_a}>
                {r.numeros_r_a} - {r.descripcion}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="modal-buttons">
          <button
            className="modal-button"
            onClick={handleAsignar}
            disabled={!competenciaSeleccionada || !resultadoSeleccionado || !usuarioId}
          >
            Asignar
          </button>
          <button className="modal-button cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Asignar;
