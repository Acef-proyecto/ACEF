import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaSearch } from 'react-icons/fa';
import "../../styles/instructor/subir.css";
import { subirArchivoActa } from "../../services/subirService";

export default function SubirActa({ actaRef, onClose, setIdActa }) {
  const [fichaId, setFichaId] = useState('');

  const handleSubir = async () => {
    try {
      if (!fichaId) {
        alert("Por favor ingresa el número de ficha.");
        return;
      }

      // 1. Captura el contenido del acta como imagen
      const canvas = await html2canvas(actaRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      // 2. Genera PDF a partir del canvas
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

      // 3. Convierte el PDF en blob y luego en File
      const blob = pdf.output('blob');
      const pdfFile = new File([blob], `acta_${Date.now()}.pdf`, {
        type: 'application/pdf',
      });

      // 4. Sube el archivo al backend
      const subida = await subirArchivoActa(pdfFile, fichaId);
      const { actaId, url } = subida;

      if (!url || !actaId) {
        throw new Error("La subida del acta no devolvió una URL o ID válido.");
      }

      alert("✅ Acta subida y asociada correctamente.");
      setIdActa(actaId);
      onClose();
    } catch (error) {
      console.error("❌ Error al subir el acta:", error);
      alert(error.mensaje || "Error al subir el acta. Verifica la consola.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-header">
          <h2>Subir acta</h2>
          <button className="cerrar-modal" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="ficha">
            <span>Ficha</span>
            <input
              type="number"
              placeholder="Ej: 1234567"
              value={fichaId}
              onChange={(e) => setFichaId(e.target.value)}
            />
            <FaSearch className="icono-buscar" />
          </div>
        </div>

        <div className="modal-footer">
          <button className="boton-verde" onClick={handleSubir}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
