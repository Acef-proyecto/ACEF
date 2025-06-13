import React, { useState } from 'react';
import { FaSignOutAlt, FaBook,FaArrowLeft, FaSearch, FaClipboard } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "../../styles/coordinacion/actas.css";

const TablaActas = ({ actas }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="pantalla">
      <header className="header">
        <button className="hamburguesa" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        {menuOpen && (
          <div className="menu">
            <button>
              <FaSignOutAlt style={{ marginRight: "8px" }} />
              Cerrar sesión
            </button>
            <button>
              <FaBook style={{ marginRight: "8px" }} />
              Manual
            </button>
            <button>
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Volver
            </button>
          </div>
        )}

        <div className="logo">
          <img src={logo} alt="Logo ACEF" className="logo-img" />
        </div>
      </header>

      <div className="contenido">
      <div className="search-section">
          <label htmlFor="ficha" className="search-label">Ficha:</label>
          <input type="number" id="ficha" className="search-input" />
          <button className="boton-lupa">
              <FaSearch />
          </button>
      </div>


      <table className="ficha-table">
        <thead>
          <tr>
            <th style={{ width: "185px" }}>Tipo</th>
            <th style={{ width: "150px" }}>Fecha</th>
            <th style={{ width: "675px" }}>Instructor</th>
            <th style={{ width: "150px" }}>Ficha</th>
            <th style={{ width: "50px" }}>Icono</th>
          </tr>
        </thead>
        <tbody>
          {actas && actas.length > 0 ? (
            actas.map((acta, idx) => (
              <tr key={idx}>
                <td>{acta.tipo}</td>
                <td>{acta.fecha}</td>
                <td>{acta.instructor}</td>
                <td>{acta.ficha}</td>
                <td>
                  <FaClipboard className="clipboard-icon" title="Ver acta" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No hay actas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default TablaActas;