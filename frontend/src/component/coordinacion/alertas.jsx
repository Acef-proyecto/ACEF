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
  const [usuarioId, setUsuarioId] = useState(null);
  const [mensajeGlobal, setMensajeGlobal] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); // 'exito' o 'error'

  const navigate = useNavigate();

  useEffect(() => {
    const savedUsuario = localStorage.getItem('usuario');
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

  useEffect(() => {
    if (mensajeGlobal) {
      const timer = setTimeout(() => {
        setMensajeGlobal('');
        setTipoMensaje('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeGlobal]);

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

  const mostrarMensaje = (texto, tipo) => {
    setMensajeGlobal(texto);
    setTipoMensaje(tipo); // 'exito' o 'error'
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

      {/* ✅ Mensaje de estado */}
      {mensajeGlobal && (
        <div className={`mensaje-global ${tipoMensaje}`}>
          {mensajeGlobal}
        </div>
      )}

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
                {!paraTodos && (
                  <div style={{ marginTop: "8px" }}>
                    <button
                      className="btn-verde-asignar"
                      onClick={() => {
                        if (!instructor.trim()) {
                          alert("Debe ingresar el correo del instructor.");
                          return;
                        }
                        mostrarMensaje("Abriendo ventana de asignación...", "exito");
                        setMostrarVentana(true);
                      }}
                    >
                      Asignar R.A
                    </button>
                  </div>
                )}
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
        </div>
      </div>

      {/* Modal de asignación */}
      <Asignar
        visible={mostrarVentana}
        onClose={handleCerrarAsignar}
        onAsignar={handleAsignacionExitosa}
        correoInstructor={instructor}
        setMensajeGlobal={(texto) => mostrarMensaje(texto, texto.startsWith("✅") ? "exito" : "error")}
      />
    </div>
  );
};

export default Alertas;
