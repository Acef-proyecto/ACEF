import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaBook, FaArrowLeft } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "../../styles/coordinacion/alertas.css";
import { useNavigate } from 'react-router-dom';
import Asignar from "../coordinacion/asignar";

const Alertas = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [instructor, setInstructor] = useState('');
  const [inicioTrimestre, setInicioTrimestre] = useState('');
  const [finTrimestre, setFinTrimestre] = useState('');
  const [paraTodos, setParaTodos] = useState(false);
  const [mostrarVentana, setMostrarVentana] = useState(false);
  const [token, setToken] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);

  const navigate = useNavigate();

  // Obtener token e información del coordinador al cargar
useEffect(() => {
  const savedToken = localStorage.getItem('token');
  const savedUsuario = localStorage.getItem('usuario');

  if (savedToken) setToken(savedToken); // <-- asegúrate de que entra aquí


    if (savedUsuario) {
      try {
        const usuario = JSON.parse(savedUsuario);
        if (usuario?.id_usuario) {
          setUsuarioId(usuario.id_usuario);
        }
      } catch (error) {
        console.error("❌ Error al leer el usuario del localStorage:", error);
      }
    }
  }, []);

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
      // Aquí puedes hacer una petición POST si decides guardar alertas

      if (paraTodos) {
        alert("✅ Alerta enviada a todos los instructores.");
      } else {
        alert("✅ Alerta enviada al instructor.");
      }

      setMensaje('');
      setInstructor('');
      setInicioTrimestre('');
      setFinTrimestre('');
      setParaTodos(false);
    } catch (error) {
      console.error("❌ Error al enviar la alerta:", error);
      alert("❌ Error al enviar la alerta.");
    }
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setParaTodos(checked);
    if (checked) setInstructor('');
  };

  const handleCerrarAsignar = () => setMostrarVentana(false);
  const handleAsignacionExitosa = () => setMostrarVentana(false);

  return (
    <div className="pantalla">
      <header className="header">
        <button className="hamburguesa" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        {menuOpen && (
          <div className="menu">
            <button onClick={() => navigate('/')}>
              <FaSignOutAlt style={{ marginRight: "8px" }} /> Cerrar sesión
            </button>
            <button>
              <FaBook style={{ marginRight: "8px" }} /> Manual
            </button>
            <button onClick={() => navigate('/coordinacion/inicio')}>
              <FaArrowLeft style={{ marginRight: "8px" }} /> Volver
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
                  /> Todos
                </label>
              </td>
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

          <button
            className="btn-verde-asignar"
            onClick={() => {
              if (!instructor || !token) {
                alert("Debe ingresar el correo del instructor y haber iniciado sesión.");
                return;
              }
              setMostrarVentana(true);
            }}
          >
            Asignar R.A
          </button>
        </div>
      </div>

      {/* Modal de Asignación */}
      <Asignar
  visible={mostrarVentana}
  onClose={handleCerrarAsignar}
  onAsignar={handleAsignacionExitosa}
  token={token} // ✅ NECESARIO
  correoInstructor={instructor} // ✅ NUEVO: correo, no id
/>
    </div>
  );
};

export default Alertas;
