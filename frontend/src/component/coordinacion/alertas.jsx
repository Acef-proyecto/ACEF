import React, { useState } from 'react';
import { FaSignOutAlt, FaBook, FaArrowLeft } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "../../styles/coordinacion/alertas.css";
import { useNavigate } from 'react-router-dom';

const Alertas = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [instructor, setInstructor] = useState('');
  const [inicioTrimestre, setInicioTrimestre] = useState('');
  const [finTrimestre, setFinTrimestre] = useState('');
  const [paraTodos, setParaTodos] = useState(false);
  const [mostrarVentana, setMostrarVentana] = useState(false);

  const [resultadoSeleccionado, setResultadoSeleccionado] = useState('');
  const resultadosAprendizaje = [
    'RA 1: Interpretar normas técnicas',
    'RA 2: Aplicar procesos de calidad',
    'RA 3: Evaluar resultados del proceso'
  ];

  const navigate = useNavigate();

  const handleAsignar = () => {
    if (!resultadoSeleccionado) {
      alert("Selecciona un resultado de aprendizaje.");
      return;
    }
    alert(`Resultado asignado: ${resultadoSeleccionado}`);
    setMostrarVentana(false);
    setResultadoSeleccionado('');
  };

  const handleEnviarAlerta = async () => {
    if (!mensaje.trim() || (!paraTodos && !instructor.trim())) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (!inicioTrimestre || !finTrimestre) {
      alert("Debes ingresar las fechas del trimestre.");
      return;
    }

    try {
      if (paraTodos) {
        const data = {
          mensaje,
          fecha_inicio: inicioTrimestre,
          fecha_fin: finTrimestre
        };
        // const res = await enviarAlertaTrimestral(data);
        alert(`✅ Alerta enviada a todos los instructores.`);
      } else {
        const data = {
          mensaje,
          correo_instructor: instructor
        };
        // const res = await enviarAlertaIndividual(data);
        alert("✅ Alerta enviada al instructor.");
      }

      setMensaje('');
      setInstructor('');
      setInicioTrimestre('');
      setFinTrimestre('');
      setParaTodos(false);
    } catch (error) {
      console.error("Error al enviar la alerta:", error);
      alert("❌ Error al enviar la alerta.");
    }
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setParaTodos(checked);
    if (checked) {
      setInstructor('');
    }
  };

  return (
    <div className="pantalla">
      <header className="header">
        <button className="hamburguesa" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        {menuOpen && (
          <div className="menu">
            <button onClick={() => navigate('/')}>
              <FaSignOutAlt style={{ marginRight: "8px" }} />
              Cerrar sesión
            </button>
            <button>
              <a
  href="/manual.html"
  target="_blank"
  rel="noopener noreferrer"
  className="menu-link"
  style={{ display: "flex", alignItems: "center", padding: "10px", textDecoration: "none", color: "inherit" }}
>
  <FaBook style={{ marginRight: "8px" }} />Manual
</a>

            </button>
            <button onClick={() => navigate('/coordinacion/inicio')}>
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Volver
            </button>
          </div>
        )}
        <div className="logo">
          <img src={logo} alt="Logo ACEF" className="logo-img" />
        </div>
      </header>

      <div className="contenido alertas-formulario">
        <table className="alerta-tabla">
          <thead>
            <tr>
              <th>Alerta</th>
              <th>Instructor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <textarea
                  className="alerta-textarea"
                  placeholder="Cuerpo de la alerta"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                />
              </td>
              <td className="instructor-celda">
                {!paraTodos && (
                  <input
                    type="email"
                    placeholder="Correo del instructor"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                  />
                )}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={paraTodos}
                    onChange={handleCheckboxChange}
                  />
                  Todos
                </label>
              </td>
              <button
                className="btn-verde-asignar"
                onClick={() => setMostrarVentana(true)}
              >
                Asignar R.A
              </button>
            </tr>
          </tbody>
        </table>

        <div className="botones-secundarios">
          <div className="campo-fecha">
            <label>Inicio Trimestre</label>
            <input
              type="date"
              value={inicioTrimestre}
              onChange={(e) => setInicioTrimestre(e.target.value)}
            />
          </div>

          <div className="campo-fecha">
            <label>Fin Trimestre</label>
            <input
              type="date"
              value={finTrimestre}
              onChange={(e) => setFinTrimestre(e.target.value)}
            />
          </div>

          <button className="btn-verde" onClick={handleEnviarAlerta}>
            Enviar Alerta
          </button>
        </div>

        {/* Modal para asignar R.A */}
        {mostrarVentana && (
          <div className="modal-ventana" role="dialog" aria-modal="true">
            <div className="modal-contenido">
              <p><strong><em>Seleccione los Resultados de aprendizaje que el instructor va a calificar</em></strong></p>

              <div className="modal-content">
                <label className="modal-label">R.A</label>
                <select
                  className="modal-select"
                  value={resultadoSeleccionado}
                  onChange={(e) => setResultadoSeleccionado(e.target.value)}
                >
                  <option value="">Seleccione...</option>
                  {resultadosAprendizaje.map((ra, index) => (
                    <option key={index} value={ra}>{ra}</option>
                  ))}
                </select>
              </div>

              <div className="modal-buttons">
                <button onClick={handleAsignar} className="modal-button">Asignar</button>
                <button onClick={() => setMostrarVentana(false)} className="btn-cerrar">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alertas;
