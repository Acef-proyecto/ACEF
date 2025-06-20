import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaSignOutAlt, FaBook } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "../../styles/instructor/acta.css";
import SubirActa from "../../component/Instructor/subir";
import { useNavigate } from 'react-router-dom';

// === Funciones auxiliares fuera del componente ===

function obtenerTrimestreYAnio() {
  const fechaActual = new Date();
  const mes = fechaActual.getMonth();
  const anio = fechaActual.getFullYear();
  const trimestres = ["I", "II", "III", "IV"];
  const trimestre = trimestres[Math.floor(mes / 3)];
  return { trimestre, anio };
}

function actualizarTextoEvaluacion() {
  const { trimestre, anio } = obtenerTrimestreYAnio();
  const texto = `Los Instructores encargados de evaluar los resultados de aprendizaje durante el ${trimestre} Trimestre de ${anio}, son:`;
  const span = document.getElementById("textoEvaluacion");
  if (span) {
    span.textContent = texto;
  }
}

function crearFilaAprendices(tbody, index) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${index}</td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><input type="text"></td>
  `;
  tbody.appendChild(row);

  const inputs = row.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', () => verificarUltimaFila(input, tbody.id));
  });
}

function crearFilaEvaluacion(tbody) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="text"/></td>
    <td contenteditable="true"></td>
    <td><input type="text"/></td>
    <td><input type="text"/></td>
    <td><input type="text"/></td>
  `;
  tbody.appendChild(row);

  const inputs = row.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', () => verificarUltimaFila(input, tbody.id));
  });
}

function verificarUltimaFila(input, tablaId) {
  const tbody = document.getElementById(tablaId);
  if (!tbody) return;
  const filas = tbody.getElementsByTagName('tr');
  const ultimaFila = filas[filas.length - 1];
  const inputs = ultimaFila?.querySelectorAll('input') || [];
  const tieneDatos = Array.from(inputs).some(inp => inp.value.trim() !== '');

  if (ultimaFila && ultimaFila.contains(input) && tieneDatos) {
    if (tablaId === 'evaluacion') {
      crearFilaEvaluacion(tbody);
    } else {
      crearFilaAprendices(tbody, filas.length + 1);
    }
  }
}

// === Componente principal ===

const Acta = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const actaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/acta/acta.html')
      .then(res => res.text())
      .then(data => setHtmlContent(data))
      .catch(err => console.error("Error al cargar el acta:", err));
  }, []);

  useEffect(() => {
    if (htmlContent) {
      setTimeout(() => {
        actualizarTextoEvaluacion();
        const tbodyAprendices = document.getElementById('aprendices');
        const tbodyAprendices2 = document.getElementById('aprendices2');
        const tbodyEvaluacion = document.getElementById('evaluacion');

        if (tbodyAprendices && tbodyAprendices.children.length === 0) {
          crearFilaAprendices(tbodyAprendices, 1);
        }
        if (tbodyAprendices2 && tbodyAprendices2.children.length === 0) {
          crearFilaAprendices(tbodyAprendices2, 1);
        }
        if (tbodyEvaluacion && tbodyEvaluacion.children.length === 0) {
          crearFilaEvaluacion(tbodyEvaluacion);
        }
      }, 0);
    }
  }, [htmlContent]);

  const handleDownloadPDF = () => {
    const input = actaRef.current;
    if (!input) {
      console.error("No se encontró el contenedor del acta.");
      return;
    }

    html2canvas(input, {
      scale: 2,
      useCORS: true,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const margin = 2;
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();

      const usableWidth = pdfPageWidth - margin * 2;
      const usableHeight = (canvas.height * usableWidth) / canvas.width;

      const totalPages = Math.ceil(usableHeight / pdfPageHeight);
      let position = 0;

      for (let i = 0; i < totalPages; i++) {
        if (i !== 0) pdf.addPage();
        pdf.addImage(
          imgData,
          'PNG',
          margin,
          -position + margin,
          usableWidth,
          usableHeight
        );
        position += pdfPageHeight;
      }

      pdf.save("acta.pdf");
    }).catch(err => {
      console.error("Error al generar el PDF:", err);
    });
  };

  return (
    <div className="pantalla">
      <header className="header">
        <button
          type="button"
          className="hamburguesa"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        {menuOpen && (
          <div className="menu">
            <button type="button" onClick={() => navigate('/')}>
              <FaSignOutAlt style={{ marginRight: 8 }} />Cerrar sesión
            </button>
            <button type="button">
              <FaBook style={{ marginRight: 8 }} />Manual
            </button>
          </div>
        )}

        <div className="logo">
          <img src={logo} alt="Logo ACEF" className="logo-img" />
        </div>
      </header>

      <div className="contenido">
        <main className="panel-principal">
          <div
            id="acta"
            ref={actaRef}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          <div className="contenedor-botones">
            <button
              type="button"
              className="boton-verde"
              onClick={() => setModalAbierto(true)}
            >
              Subir acta
            </button>

            <button
              type="button"
              className="boton-verde"
              onClick={handleDownloadPDF}
            >
              Descargar
            </button>
          </div>

          {modalAbierto && (
            <SubirActa
              actaRef={actaRef}
              onClose={() => setModalAbierto(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Acta;