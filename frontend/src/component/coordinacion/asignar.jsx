import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/coordinacion/asignar.css';
import { asignarRA } from '../../services/asignarService';

const Asignar = ({
  visible,
  onClose,
  onAsignar,
  correoInstructor,
  setMensajeGlobal
}) => {
  const [usuarioId, setUsuarioId] = useState(null);
  const [competencias, setCompetencias] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [competenciaSeleccionada, setCompetenciaSeleccionada] = useState('');
  const [resultadoSeleccionado, setResultadoSeleccionado] = useState('');
  const [asignando, setAsignando] = useState(false);

  // ✅ useEffect para buscar usuario
  useEffect(() => {
    if (correoInstructor) {
      console.log("🔍 Buscando usuario por correo...");
      axios.get(`/api/usuario/correo/${correoInstructor}`)
        .then(res => {
          console.log("✅ Usuario encontrado:", res.data);
          setUsuarioId(res.data.id_usuario);
        })
        .catch(err => {
          console.error("❌ Error al obtener usuario:", err);
          setMensajeGlobal("❌ No se encontró un usuario con ese correo.");
          onClose();
        });
    }
  }, [correoInstructor]);

  // ✅ useEffect para cargar competencias
  useEffect(() => {
    axios.get('http://localhost:3000/api/competencias')
      .then(res => setCompetencias(res.data))
      .catch(err => console.error("❌ Error al obtener competencias:", err));
  }, []);

  // ✅ useEffect para cargar resultados cuando se elige una competencia
  useEffect(() => {
    if (competenciaSeleccionada) {
      axios.get(`http://localhost:3000/api/resultados/${competenciaSeleccionada}`)
        .then(res => {
          setResultados(Array.isArray(res.data) ? res.data : []);
        })
        .catch(err => {
          console.error("❌ Error al obtener resultados:", err);
          setResultados([]);
        });
    } else {
      setResultados([]);
    }
  }, [competenciaSeleccionada]);

  // ✅ Función para asignar
  const handleAsignar = async () => {
    console.log("🟢 Botón ASIGNAR presionado");

    if (!usuarioId || !competenciaSeleccionada || !resultadoSeleccionado) {
      alert('Faltan datos para asignar');
      return;
    }

    setAsignando(true);
    try {
      const res = await asignarRA({
        usuario_id: usuarioId,
        competencia_id: competenciaSeleccionada,
        r_a_id: resultadoSeleccionado
      });

      if (res.ok) {
        setMensajeGlobal(`✅ ${res.mensaje || 'Asignación completada'}`);
        onAsignar();
        onClose();
      } else {
        setMensajeGlobal(`❌ ${res.mensaje || 'No se pudo asignar el resultado'}`);
      }
    } catch (error) {
      console.error("❌ Error al asignar:", error);
      setMensajeGlobal("❌ Error inesperado al asignar resultado");
    } finally {
      setAsignando(false);
    }
  };

  // 🧠 Mover esto al final del cuerpo del componente, después de todos los hooks
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <p><strong><em>Seleccione los Resultados de Aprendizaje que el instructor va a calificar</em></strong></p>

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
            {competencias.map((c) => (
              <option key={c.id_competencia} value={c.id_competencia}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-content">
          <label className="modal-label">Resultado de Aprendizaje</label>
          <select
            className="modal-input"
            value={resultadoSeleccionado}
            onChange={(e) => setResultadoSeleccionado(e.target.value)}
            disabled={!competenciaSeleccionada}
          >
            <option value="">Seleccione un resultado</option>
            {resultados.map((r) => (
              <option key={r.id_r_a} value={r.id_r_a}>
                {r.numeros_r_a} - {r.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-buttons">
          <button
            className="modal-button"
            onClick={handleAsignar}
            disabled={asignando || !usuarioId || !competenciaSeleccionada || !resultadoSeleccionado}
          >
            {asignando ? "Asignando..." : "Asignar"}
          </button>
          <button
            className="modal-button cancel"
            onClick={() => {
              console.log("❌ Botón CANCELAR presionado");
              onClose();
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Asignar;
