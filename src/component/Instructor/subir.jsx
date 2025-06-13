import React from 'react';
import "../../styles/instructor/subir.css";
import { FaSearch } from 'react-icons/fa';

export default function SubirActa({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-header">
          <h2>Tipo de acta</h2>
          <button className="cerrar-modal" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <label>
            <input type="checkbox" /> 
            Acta General
          </label>
          <label>
            <input type="checkbox" />
            Acta Individual
          </label>

          <div className="ficha">
            <span>Ficha</span>
            <input type="text" />
            <FaSearch className="icono-buscar" />
          </div>
        </div>

        <div className="modal-footer">
          <button className="boton-verde" onClick={onClose}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}