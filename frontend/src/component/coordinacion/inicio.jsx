import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBook, FaSearch } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { buscarFichaPrograma } from "../../services/busquedaService";
import "../../styles/coordinacion/inicio.css";

const Inicio = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [programa, setPrograma] = useState('');
  const [ficha, setFicha] = useState('');
  const [listaProgramas, setListaProgramas] = useState([]);
  const [listaFichas, setListaFichas] = useState([]);
  const navigate = useNavigate();

  // Cargar programas únicos al inicio
  useEffect(() => {
    const cargarProgramas = async () => {
      try {
        const data = await buscarFichaPrograma();
        const programasUnicos = [...new Set(data.map(p => p.programa))];
        setListaProgramas(programasUnicos);
      } catch (error) {
        console.error('Error al cargar programas:', error);
      }
    };
    cargarProgramas();
  }, []);

  // Cargar fichas según programa seleccionado
  useEffect(() => {
    const cargarFichas = async () => {
      if (programa) {
        try {
          const data = await buscarFichaPrograma(null, programa);
          const fichasUnicas = [...new Set(data.map(f => f.ficha))];
          setListaFichas(fichasUnicas);
        } catch (error) {
          console.error('Error al cargar fichas:', error);
        }
      } else {
        setListaFichas([]);
      }
    };
    cargarFichas();
  }, [programa]);

  const handleBuscar = async () => {
  try {
    const resultados = await buscarFichaPrograma(ficha, programa);
    if (resultados.length > 0) {
      navigate('/coordinacion/filtro', {
        state: { ficha, programa }
      });
    } else {
      alert("No se encontraron resultados con esos filtros.");
    }
  } catch (error) {
    alert(error.mensaje || 'No se encontraron resultados');
  }
};


  return (
    <div className="pantalla">
      <header className="header">
        <button className="hamburguesa" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        {menuOpen && (
          <div className="menu">
            <button onClick={() => navigate('/')}><FaSignOutAlt style={{ marginRight: "8px" }} />Cerrar sesión</button>
            <button><FaBook style={{ marginRight: "8px" }} />Manual</button>
          </div>
        )}
        <div className="logo">
          <img src={logo} alt="Logo ACEF" className="logo-img" />
        </div>
      </header>

      <div className="barra-navegacion">
        <button className="btn-top" onClick={() => navigate('/coordinacion/actas')}>Actas</button>
        <button className="btn-top" onClick={() => navigate('/coordinacion/alertas')}>Alertas</button>
        <button className="btn-top" onClick={() => navigate('/coordinacion/registro')}>Crear Usuario</button>
      </div>

      <div className="panel-formulario">
        <h2>Consulta aquí</h2>
        <p className="subtexto">Selecciona un programa y su ficha correspondiente</p>
        <div className="formulario">
          <div className="campo">
            <label>Programa</label>
            <div className="input-select">
              <select value={programa} onChange={(e) => setPrograma(e.target.value)}>
                <option value="">Selecciona programa</option>
                {listaProgramas.map((prog, i) => (
                  <option key={i} value={prog}>{prog}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="campo">
            <label>Ficha</label>
            <div className="input-select-con-boton">
              <div className="input-select">
                <select value={ficha} onChange={(e) => setFicha(e.target.value)}>
                  <option value="">Selecciona ficha</option>
                  {listaFichas.map((f, i) => (
                    <option key={i} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <button className="boton-lupa" onClick={handleBuscar}>
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
