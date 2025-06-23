import React, { useState } from 'react';
import { FaSignOutAlt, FaBook, FaArrowLeft } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "../../styles/coordinacion/alertas.css";
import { useNavigate } from 'react-router-dom';
import { enviarAlertaTrimestre } from '../../services/trimestreService';

const Alertas = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // const [mensaje, setMensaje] = useState('');
  // const [instructor, setInstructor] = useState('');
  const [inicioTrimestre, setInicioTrimestre] = useState('');
  const [finTrimestre, setFinTrimestre] = useState('');

  const navigate = useNavigate();

  const handleEnviarAlerta = async () => {
    // if (!mensaje.trim() || !instructor.trim() || !inicioTrimestre || !finTrimestre) {
    if (!inicioTrimestre || !finTrimestre) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const alerta = {
      // mensaje,
      // instructor,
      inicioTrimestre,
      finTrimestre
    };

    try {
      const res = await enviarAlertaTrimestre(alerta);
      alert("✅ Alerta enviada correctamente.");
      console.log("Respuesta:", res);

      // setMensaje('');
      // setInstructor('');
      setInicioTrimestre('');
      setFinTrimestre('');
    } catch (error) {
      alert("❌ Error al enviar la alerta.");
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
              <FaBook style={{ marginRight: "8px" }} />
              Manual
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
        <div className="alerta-container">

          {/* Título */}
          <div className="alerta-header">
            <div className="alerta-titulo">Alerta</div>
            <div className="instructor-titulo">Instructor</div>
          </div>

          {/* Área principal */}
          <div className="alerta-body">
            <textarea
              placeholder="Cuerpo de la alerta"
              // value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />
            <input
              type="text"
              placeholder="Correo del instructor"
              //value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
            /> 
          </div>

          {/* Fechas y botón */}
          <div className="alerta-botones-horizontal">
            <label className="trimestre-label">
              Inicio Trimestre
              <input
                type="date"
                value={inicioTrimestre}
                onChange={(e) => setInicioTrimestre(e.target.value)}
              />
            </label>

            <label className="trimestre-label">
              Fin Trimestre
              <input
                type="date"
                value={finTrimestre}
                onChange={(e) => setFinTrimestre(e.target.value)}
              />
            </label>

            <button className="enviar-btn" onClick={handleEnviarAlerta}>
              Enviar Alerta
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Alertas;