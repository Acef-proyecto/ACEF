import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBook, FaArrowLeft, FaSearch } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "../../styles/coordinacion/filtro.css";

const Filtros = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); 

  return (
    <div className="pantalla">
      <header className="header">
        <button
          className="hamburguesa"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {menuOpen && (
          <nav className="menu" aria-label="Menú principal">
            <button type="button" className="menu-button">
              <FaSignOutAlt style={{ marginRight: "8px" }} />
              Cerrar sesión
            </button>
            <button type="button" className="menu-button">
              <FaBook style={{ marginRight: "8px" }} />
              Manual
            </button>
            <button type="button" className="menu-button">
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Volver
            </button>
          </nav>
        )}

        <div className="logo">
          <img src={logo} alt="Logo ACEF" className="logo-img" />
        </div>
      </header>

      <div className="contenido">
        <div className="filtros">
          <div className="grupo-dropdowns">
            <button className="dropdown">Competencia ▼</button>
            <button className="dropdown">R.A ▼</button>
          </div>
          <div className="grupo-boton">
            <button className="boton-lupa" onClick={() => navigate('/coordinacion/resultados')}>
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filtros;