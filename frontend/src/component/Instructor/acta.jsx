import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaSignOutAlt, FaBook } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "../../styles/instructor/acta.css";
import SubirActa from "../../component/Instructor/subir";
import CompartirCorreo from "../Instructor/compartir";
import ListaActas from "../Instructor/actasCompartidas";
import { useNavigate } from 'react-router-dom';

// === Funciones auxiliares ===
function obtenerTrimestreYAnio() {
  const fecha = new Date();
  const trimestre = ["I", "II", "III", "IV"][Math.floor(fecha.getMonth() / 3)];
  return { trimestre, anio: fecha.getFullYear() };
}

function actualizarTextoEvaluacion() {
  const { trimestre, anio } = obtenerTrimestreYAnio();
  const span = document.getElementById("textoEvaluacion");
  if (span) {
    span.textContent = `Los Instructores encargados de evaluar los resultados de aprendizaje durante el ${trimestre} Trimestre de ${anio}, son:`;
  }
}

function crearFilaAprendices(tbody, index) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${index}</td>
    <td><input type="text" /></td>
    <td><input type="text" /></td>
    <td><input type="text" /></td>
    <td><input type="text" /></td>
    <td><input type="text" /></td>
  `;
  tbody.appendChild(row);
  row.querySelectorAll('input').forEach(input =>
    input.addEventListener('input', () => verificarUltimaFila(input, tbody.id))
  );
}

function crearFilaEvaluacion(tbody) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="text" /></td>
    <td contenteditable="true"></td>
    <td><input type="text" /></td>
    <td><input type="text" /></td>
    <td><input type="text" /></td>
  `;
  tbody.appendChild(row);
  row.querySelectorAll('input').forEach(input =>
    input.addEventListener('input', () => verificarUltimaFila(input, tbody.id))
  );
}

function verificarUltimaFila(input, tablaId) {
  const tbody = document.getElementById(tablaId);
  if (!tbody) return;
  const filas = tbody.getElementsByTagName('tr');
  const ultima = filas[filas.length - 1];
  const tieneDatos = Array.from(ultima?.querySelectorAll('input') || []).some(inp => inp.value.trim() !== '');
  if (ultima?.contains(input) && tieneDatos) {
    tablaId === 'evaluacion' ? crearFilaEvaluacion(tbody) : crearFilaAprendices(tbody, filas.length + 1);
  }
}

// === Componente principal ===
const Acta = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalVentana, setModalVentana] = useState(false);
  const [modalCompartirAbierto, setModalCompartirAbierto] = useState(false);
  const [idActa, setIdActa] = useState(null);
  const actaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/acta/acta.html')
      .then(res => res.text())
      .then(setHtmlContent)
      .catch(err => console.error("Error al cargar el acta:", err));
  }, []);

  useEffect(() => {
    if (!htmlContent) return;
    setTimeout(() => {
      actualizarTextoEvaluacion();
      const t1 = document.getElementById('aprendices');
      const t2 = document.getElementById('aprendices2');
      const t3 = document.getElementById('evaluacion');
      if (t1 && !t1.children.length) crearFilaAprendices(t1, 1);
      if (t2 && !t2.children.length) crearFilaAprendices(t2, 1);
      if (t3 && !t3.children.length) crearFilaEvaluacion(t3);
    }, 0);
  }, [htmlContent]);

  const handleDownloadPDF = () => {
    const input = actaRef.current;
    if (!input) return console.error("No se encontró el contenedor del acta.");
    html2canvas(input, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 2;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * (pageWidth - margin * 2)) / canvas.width;
      let position = 0;
      const totalPages = Math.ceil(imgHeight / pageHeight);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, -position + margin, pageWidth - margin * 2, imgHeight);
        position += pageHeight;
      }

      pdf.save("acta.pdf");
    }).catch(err => console.error("Error al generar PDF:", err));
  };

  return (
    <div className="pantalla">
      <header className="header">
        <button
          className="hamburguesa"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        {menuOpen && (
          <div className="menu">
            <button onClick={() => navigate('/')}>
              <FaSignOutAlt style={{ marginRight: 8 }} /> Cerrar sesión
            </button>
            <button>
              <FaBook style={{ marginRight: 8 }} /> Manual
            </button>
          </div>
        )}

        <div className="logo">
          <img src={logo} alt="Logo ACEF" className="logo-img" />
        </div>
      </header>

      <div className="contenido-flex">

        <aside className="panel-secundario">
          <div className="contenedor-botones">
            <button className="boton-verde" onClick={() => {
              if (!idActa) {
                alert("Primero debes subir el acta antes de compartir.");
                return;
              }
              setModalCompartirAbierto(true);
            }}>
              Compartir
            </button>

            <button className="boton-verde" onClick={() => setModalVentana(true)}>
              Ver actas compartidas
            </button>

            <button className="boton-verde" onClick={() => setModalAbierto(true)}>
              Subir acta
            </button>

            <button className="boton-verde" onClick={handleDownloadPDF}>
              Descargar
            </button>

            <button className="boton-verde">
              Firma
            </button>
          </div>
        </aside>

        <main className="panel-principal">
          <div
            id="acta"
            ref={actaRef}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {modalAbierto && (
            <SubirActa
              actaRef={actaRef}
              onClose={() => setModalAbierto(false)}
              setIdActa={setIdActa}
            />
          )}

          {modalCompartirAbierto && (
            <CompartirCorreo
              IdActa={idActa}
              onClose={() => setModalCompartirAbierto(false)}
            />
          )}

          {modalVentana && (
            <ListaActas
              onClose={() => setModalVentana(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Acta;
