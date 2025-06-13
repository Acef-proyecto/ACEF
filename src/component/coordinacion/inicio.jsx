import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBook, FaSearch } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "../../styles/coordinacion/inicio.css";

const Inicio = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="pantalla">
      <header className="header">
        <button className="hamburguesa" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        {menuOpen && (
          <div className="menu">
            <button><FaSignOutAlt style={{ marginRight: "8px" }} />Cerrar sesión</button>
            <button><FaBook style={{ marginRight: "8px" }} />Manual</button>
          </div>
        )}
        <div className="logo">
          <img src={logo} alt="Logo ACEF" className="logo-img" />
        </div>
      </header>

      {/* Panel superior de navegación */}
      <div className="barra-navegacion">
        <button className="btn-top" onClick={() => navigate('/coordinacion/actas')}>Actas</button>
        <button className="btn-top" onClick={() => navigate('/coordinacion/alertas')}>Alertas</button>
      </div>

      {/* Panel principal centrado */}
      <div className="panel-formulario">
        <h2>Consulta aquí</h2>
        <p className="subtexto">Escribe o despliega.</p>
        <div className="formulario">
          <div className="campo">
            <label>Programa</label>
            <div className="input-select">
              <input type="text" placeholder="Selecciona programa" />
              <span className="flecha">▼</span>
            </div>
          </div>
          <div className="campo">
            <label>Ficha</label>
            <div className="input-select-con-boton">
              <div className="input-select">
                <input type="number" placeholder="Selecciona ficha" />
                <span className="flecha">▼</span>
              </div>
            </div>
          </div>
          <button
            className="boton-lupa"
            onClick={() => navigate('/coordinacion/filtro')}>
            <FaSearch />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inicio;