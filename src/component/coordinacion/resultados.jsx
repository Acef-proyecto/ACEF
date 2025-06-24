import React, { useEffect, useState } from 'react';
import { FaSignOutAlt, FaBook, FaArrowLeft } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "../../styles/coordinacion/resultados.css";
import { useLocation, useNavigate } from 'react-router-dom';

const Resultados = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aprendices, setAprendices] = useState([]);
  const [info, setInfo] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Validar que vienen datos de Filtros.jsx
  /*useEffect(() => {
    if (!location.state) {
      navigate('/coordinacion/filtro');
      return;
    }

    const { programa, ficha, competencia, resultadoAprendizaje } = location.state;

    const fetchDatos = async () => {
      try {
        const params = new URLSearchParams({
          programa,
          ficha,
          competencia,
          resultado: resultadoAprendizaje
        });

        const res = await fetch(`http://localhost:8000/resultados?${params.toString()}`);
        if (!res.ok) throw new Error("Error en la consulta");

        const data = await res.json();

        setAprendices(data.aprendices || []);
        setInfo(data.info || {
          programa,
          ficha,
          competencia,
          resultadoAprendizaje
        });
        setCargando(false);
      } catch (err) {
        setError("No se pudo cargar la información.");
        setCargando(false);
      }
    };

    fetchDatos();
  }, [location, navigate]);*/

  useEffect(() => {
    if (!location.state) {
      navigate('/coordinacion/filtro');
      return;
    }

    const { programa, ficha, competencia, resultadoAprendizaje } = location.state;

    // Datos simulados
    const datosSimulados = {
      info: {
        programa,
        ficha,
        competencia,
        resultadoAprendizaje
      },
      aprendices: [
        { nombre: "Ana Rodríguez", evaluado: "Aprobado" },
        { nombre: "Carlos Gómez", evaluado: "Pendiente" },
        { nombre: "Laura Mendoza", evaluado: "" }
      ]
    };

    // Simula carga
    setTimeout(() => {
      setInfo(datosSimulados.info);
      setAprendices(datosSimulados.aprendices);
      setCargando(false);
    }, 1000); // solo para mostrar el "cargando..." un segundo

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
              <p><strong>R.A:</strong> {info.resultadoAprendizaje}</p>
            </div>

            {aprendices.length > 0 ? (
              <table className="tabla-aprendices">
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>APRENDICES</th>
                    <th>EVALUADO</th>
                  </tr>
                </thead>
                <tbody>
                  {aprendices.map((a, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{a.nombre}</td>
                      <td style={{ width: "375px" }}>{a.evaluado || "No evaluado"}</td>
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
