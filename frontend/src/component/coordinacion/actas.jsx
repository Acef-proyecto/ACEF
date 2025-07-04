// src/component/coordinacion/acta.jsx

import React, { useState } from 'react';
import {
  FaSignOutAlt,
  FaBook,
  FaArrowLeft,
  FaSearch,
  FaClipboard
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import '../../styles/coordinacion/actas.css';

export default function Acta() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [ficha, setFicha]           = useState('');
  const [startDate, setStartDate]   = useState('');
  const [endDate, setEndDate]       = useState('');
  const [actas, setActas]           = useState([]);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!ficha) {
      setError('Ingresa un número de ficha');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ ficha });
      if (startDate) params.append('startDate', startDate);
      if (endDate)   params.append('endDate', endDate);

      const res = await fetch(`http://localhost:3000/api/acta?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('No se pudieron cargar las actas');
      const data = await res.json();
      setActas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

      <main className="contenido">
        <div className="search-section">
          <label className="search-label">Ficha:</label>
          <input
            type="number"
            className="search-input"
            value={ficha}
            onChange={e => setFicha(e.target.value)}
            placeholder="Ej. 282505"
          />
          <label className="search-label">Desde:</label>
          <input
            type="date"
            className="search-input"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <label className="search-label">Hasta:</label>
          <input
            type="date"
            className="search-input"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
          <button
            className="boton-lupa"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Cargando...' : <FaSearch />}
          </button>
        </div>

        {error && <p className="acta-error">{error}</p>}

        <div className="acta-table-wrapper">
          <table className="ficha-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Instructor</th>
                <th>Ficha</th>
                <th>Ver</th>
              </tr>
            </thead>
            <tbody>
              {actas.length > 0 ? (
                actas.map(acta => (
                  <tr key={acta.id_acta}>
                    <td>{new Date(acta.fecha_subida).toLocaleDateString()}</td>
                    <td>{acta.instructor}</td>
                    <td>{acta.ficha_numero}</td>
                    <td>
                      <a
                        href={acta.anexos}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaClipboard className="clipboard-icon" />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    {loading ? 'Buscando actas...' : 'No hay actas registradas.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
