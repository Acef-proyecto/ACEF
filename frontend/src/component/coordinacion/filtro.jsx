import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaBook, FaArrowLeft, FaSearch } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "../../styles/coordinacion/filtro.css";
import { obtenerCompetencias, obtenerResultados } from "../../services/filtrosService";

const Filtros = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [competencias, setCompetencias] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [competenciaSeleccionada, setCompetenciaSeleccionada] = useState("");
  const [resultadoSeleccionado, setResultadoSeleccionado] = useState("");
  const [resultadoTexto, setResultadoTexto] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const ficha = location.state?.ficha || "";
  const programa = location.state?.programa || "";

  useEffect(() => {
    if (!ficha || !programa) {
      navigate("/coordinacion/inicio");
    }
  }, [ficha, programa, navigate]);

  const competenciaTexto = competencias.find(c => c.id_competencia === parseInt(competenciaSeleccionada))?.nombre || "";

  useEffect(() => {
    const cargarCompetencias = async () => {
      if (ficha && programa) {
        try {
          const data = await obtenerCompetencias(ficha, programa);
          setCompetencias(data);
        } catch (err) {
          console.error("Error al cargar competencias:", err);
        }
      }
    };
    cargarCompetencias();
  }, [ficha, programa]);

  useEffect(() => {
    const cargarResultados = async () => {
      if (competenciaSeleccionada) {
        try {
          const data = await obtenerResultados(competenciaSeleccionada);
          setResultados(data);
        } catch (err) {
          console.error("Error al cargar resultados:", err);
        }
      } else {
        setResultados([]);
        setResultadoSeleccionado("");
        setResultadoTexto("");
      }
    };
    cargarResultados();
  }, [competenciaSeleccionada]);

  const handleResultadoChange = (e) => {
    const id = e.target.value;
    setResultadoSeleccionado(id);
    const resultado = resultados.find(r => r.id_r_a === parseInt(id));
    setResultadoTexto(resultado?.descripcion || "");
  };

  const handleBuscar = () => {
    if (competenciaSeleccionada && resultadoSeleccionado) {
      navigate('/coordinacion/resultados', {
        state: {
          programa,
          ficha,
          competencia: competenciaTexto,
          resultadoAprendizaje: resultadoTexto,
          competencia_id: competenciaSeleccionada,
          resultado_id: resultadoSeleccionado
        }
      });
    } else {
      alert("Por favor selecciona una competencia y un resultado.");
    }
  };

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
            <button type="button" className="menu-button" onClick={() => navigate('/')}>
              <FaSignOutAlt style={{ marginRight: "8px" }} /> Cerrar sesión
            </button>
            <button type="button" className="menu-button">
              <FaBook style={{ marginRight: "8px" }} /> Manual
            </button>
            <button type="button" className="menu-button" onClick={() => navigate('/coordinacion/inicio')}>
              <FaArrowLeft style={{ marginRight: "8px" }} /> Volver
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
            <select
              className="dropdown"
              value={competenciaSeleccionada}
              onChange={(e) => setCompetenciaSeleccionada(e.target.value)}
            >
              <option value="">Seleccione competencia</option>
              {competencias.map((comp) => (
                <option key={comp.id_competencia} value={comp.id_competencia}>
                  {comp.nombre}
                </option>
              ))}
            </select>

            <select
              className="dropdown"
              value={resultadoSeleccionado}
              onChange={handleResultadoChange}
              disabled={!competenciaSeleccionada}
            >
              <option value="">Seleccione R.A</option>
              {resultados.map((ra) => (
                <option key={ra.id_r_a} value={ra.id_r_a}>
                  {ra.numeros_r_a}
                </option>
              ))}
            </select>
          </div>

          <div className="grupo-boton">
            <button className="boton-lupa" onClick={handleBuscar}>
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filtros;
