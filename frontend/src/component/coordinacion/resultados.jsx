import React, { useEffect, useState } from 'react';
import { FaSignOutAlt, FaBook, FaArrowLeft } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "../../styles/coordinacion/resultados.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { obtenerAprendices } from '../../services/filtrosService';

const Resultados = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aprendices, setAprendices] = useState([]);
  const [info, setInfo] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      navigate('/coordinacion/filtro');
      return;
    }

    const {
      programa,
      ficha,
      competencia,
      resultadoAprendizaje,
      competencia_id,
      resultado_id
    } = location.state;

    const fetchDatos = async () => {
      try {
        const aprendicesData = await obtenerAprendices(ficha, programa, competencia_id, resultado_id);
        console.log("✔️ Aprendices recibidos:", aprendicesData);
        setAprendices(aprendicesData || []);
        setInfo({ programa, ficha, competencia, resultadoAprendizaje });
        setCargando(false);
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
        setError("No se pudo cargar la información.");
        setCargando(false);
      }
    };

    fetchDatos();
  }, [location, navigate]);

  return (
    <div className="pantalla">
      <header className="header">
        <button className="hamburguesa" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        {menuOpen && (
          <div className="menu">
            <button onClick={() => navigate('/')}><FaSignOutAlt style={{ marginRight: "8px" }} />Cerrar sesión</button>
            <button><FaBook style={{ marginRight: "8px" }} />Manual</button>
            <button onClick={() => navigate('/coordinacion/filtro')}><FaArrowLeft style={{ marginRight: "8px" }} />Volver</button>
          </div>
        )}
        <div className="logo">
          <img src={logo} alt="Logo ACEF" className="logo-img" />
        </div>
      </header>

      <div className="contenido">
        {cargando ? (
          <p>Cargando datos...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="info">
              <p><strong>Programa:</strong> {info.programa}</p>
              <p><strong>Ficha:</strong> {info.ficha}</p>
              <p><strong>Competencia:</strong> {info.competencia}</p>
              <p><strong>Resultado de Aprendizaje:</strong> {info.resultadoAprendizaje}</p>
            </div>

            {aprendices.length > 0 ? (
              <table className="tabla-aprendices">
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Aprendices</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {aprendices.map((a, i) => (
                    <tr key={a.id_aprendiz || i}>
                      <td>{i + 1}</td>
                      <td>{a.nombre}</td>
                      <td>
                        {a.evaluado === 1
                          ? "Evaluado"
                          : a.evaluado === 0
                          ? "No evaluado"
                          : "Pendiente"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay aprendices para mostrar.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Resultados;
