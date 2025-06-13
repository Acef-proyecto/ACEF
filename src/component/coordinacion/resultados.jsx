import React, { useEffect, useState } from 'react';
import { FaSignOutAlt, FaBook, FaSearch, FaArrowLeft } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "../../styles/coordinacion/resultados.css";

const Resultados = () => {
  const [menuOpen, setMenuOpen] = useState(false);
 //const [aprendices, setAprendices] = useState([]);
  /*const [info, setInfo] = useState({
    programa: '',
    ficha: '',
    trimestre: '',
    competencia: '',
    resultadoAprendizaje: ''
  });*/

  const [aprendices, setAprendices] = useState([
  { nombre: "Juan Pérez", evaluado: "Evaluado" }
  ]);

  const [info, setInfo] = useState({
    programa: "ADSO",
    ficha: "2926503",
    trimestre: "6",
    competencia: "Resultado de Aprendizaje de la Inducción",
    resultadoAprendizaje: " 01  Identificar la dinámica organizacional del SENA y el rol de la formación profesional integral de acuerdo con su proyecto de vida y el desarrollo profesional."
  });


  // Obtener datos del backend
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resAprendices = await fetch('http://localhost:8000/aprendices');
        const dataAprendices = await resAprendices.json();
        const formateados = dataAprendices.map(a => ({
          nombre: `${a.nombres} ${a.apellidos}`,
          evaluado: `${a.evaluado}`
        }));
        setAprendices(formateados);

        const resInfo = await fetch('http://localhost:8000/informacion');
        const dataInfo = await resInfo.json();
        setInfo(dataInfo);

      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchDatos();
  }, []);

  const handleChange = (index, field, value) => {
    const nuevos = [...aprendices];
    nuevos[index][field] = value;
    setAprendices(nuevos);
  };

  return (
    <div className="pantalla">
      <header className="header">
        <button className="hamburguesa" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        {menuOpen && (
          <div className="menu">
            <button><FaSignOutAlt style={{ marginRight: "8px" }} />Cerrar sesión</button>
            <button><FaBook style={{ marginRight: "8px" }} />Manual</button>
            <button><FaArrowLeft style={{ marginRight: "8px" }} />Volver</button>
          </div>
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

      <div className="info">
        <p><strong>Programa:</strong>{info.programa}</p>
        <p><strong>Ficha:</strong> {info.ficha}</p>
        <p><strong>Trimestre:</strong> {info.trimestre}</p>
        <p><strong>Competencia:</strong> {info.competencia}</p>
        <p><strong>R.A:</strong>{info.resultadoAprendizaje}</p>
      </div>
      

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
    </div>
    </div>
  );
};

export default Resultados;