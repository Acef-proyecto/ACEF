import React, { useEffect, useState } from 'react';
import "../../styles/Instructor/actasCompartidas.css";

export default function ListaActas({ onClose }) {
  const [actas, setActas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActas = async () => {
      try {
        const token = localStorage.getItem('token');
        const resultado = await obtenerActasCompartidas(token);
        setActas(resultado);
      } catch (err) {
        console.error('❌ Error al cargar actas compartidas:', err);
        setError('No se pudieron cargar las actas compartidas.');
      } finally {
        setCargando(false);
      }
    };

    fetchActas();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-header">
          <h2>Actas Compartidas</h2>
          <button className="cerrar-modal" onClick={onClose} aria-label="Cerrar modal">✕</button>
        </div>

        <div className="tabla-actas-container">
          {cargando ? (
            <p>Cargando actas...</p>
          ) : error ? (
            <p className="mensaje-error">{error}</p>
          ) : actas.length === 0 ? (
            <p>No tienes actas compartidas.</p>
          ) : (
            <table className="tabla-actas">
              <thead>
                <tr>
                  <th>Compartida por</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {actas.map((acta) => (
                  <tr key={acta.id}>
                    <td>{acta.compartido_por}</td>
                    <td>{new Date(acta.fecha_envio).toLocaleDateString()}</td>
                    <td>
                      <a
                        href={acta.anexos}
                        className="ver-acta"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver Acta
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}