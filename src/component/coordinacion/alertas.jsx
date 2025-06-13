import React, { useState } from 'react';
import { FaSignOutAlt, FaBook, FaArrowLeft } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "../../styles/coordinacion/alertas.css";

const Alertas = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [alertas, setAlertas] = useState([]);

  const handleCrearAlerta = () => {
    const nuevaAlerta = {
      mensaje: "Nueva alerta generada.",
      instructor: "Juan Pérez",
      fecha: new Date().toLocaleDateString('es-CO') // Ej: 11/06/2025
    };
    setAlertas(prev => [...prev, nuevaAlerta]);
  };

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
        <main className="alertas-main">
          <div className="filtros">
            <label>
              Inicio Trimestre
              <input type="date" />
            </label>
            <label>
              Fin Trimestre
              <input type="date" />
            </label>
            <button className="crear-alerta" onClick={handleCrearAlerta}>Crear alertas</button>
          </div>

          <table className="tabla-alertas">
            <thead>
              <tr>
                <th style={{ width: "500px" }}>Mensaje</th>
                <th style={{ width: "450px" }}>Instructor</th>
                <th style={{ width: "185px" }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {alertas.length > 0 ? (
                <>
                  {alertas.map((alerta, idx) => (
                    <tr key={idx}>
                      <td>{alerta.mensaje}</td>
                      <td>{alerta.instructor}</td>
                      <td>{alerta.fecha}</td>
                    </tr>
                  ))}
                  {[...Array(8 - alertas.length)].map((_, index) => (
                    <tr key={`empty-${index}`}>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No hay alertas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default Alertas;