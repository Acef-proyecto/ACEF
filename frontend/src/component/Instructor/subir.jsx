import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaSearch } from 'react-icons/fa';
import "../../styles/instructor/subir.css";
import { subirArchivoActa, guardarURLActa } from "../../services/actasService";

export default function SubirActa({ actaRef, onClose, setIdActa }) {
  const handleSubir = async () => {
    try {
      if (!actaRef?.current) {
        alert('No se encontró el contenido del acta.');
        return;
      }

      // Captura el contenido del acta como imagen y la convierte en PDF
      const canvas = await html2canvas(actaRef.current, { scale: 2 });
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
        pdf.addImage(imgData, 'PNG', margin, -position + margin, usableWidth, usableHeight);
        position += pdfPageHeight;
      }

      const blob = pdf.output('blob');
      const pdfFile = new File([blob], `acta_general_${Date.now()}.pdf`, { type: 'application/pdf' });

      // Subir archivo al servidor
      const subida = await subirArchivoActa(pdfFile);
      const url = subida.url;

      if (!url) {
        throw new Error("Debes proporcionar una URL válida para el archivo.");
      }

      // Guardar URL en la base de datos
      const resultado = await guardarURLActa(url);
      if (resultado && resultado.acta_id) {
        alert("✅ Acta subida y guardada con éxito.");
        setIdActa(resultado.acta_id); // ✅ guardamos el ID generado
        onClose();
      } else {
        throw new Error("No se recibió acta_id del backend.");
      }

    } catch (error) {
      console.error("❌ Error al subir el acta:", error);
      alert(error.mensaje || "Error al subir el acta. Verifica la consola.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-header">
          <h2>Tipo de acta</h2>
          <button className="cerrar-modal" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <label>
            <input type="checkbox" defaultChecked /> 
            Acta General
          </label>
          <label>
            <input type="checkbox" disabled />
            Acta Individual
          </label>

          <div className="ficha">
            <span>Ficha</span>
            <input type="number" placeholder="Ej: 1234567" />
            <FaSearch className="icono-buscar" />
          </div>
        </div>

        <div className="modal-footer">
          <button className="boton-verde" onClick={handleSubir}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}