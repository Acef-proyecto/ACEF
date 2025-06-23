import React from 'react';
import "../../styles/instructor/compartir.css";

export default function CompartirCorreo({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-body">

          {/* Línea con texto e ícono de cerrar */}
          <div className="instruccion-con-cierre">
            <p className="instruccion">
              <em>Escriba el correo del instructor que desea compartir</em>
            </p>
            <button className="cerrar-modal" onClick={onClose}>✕</button>
          </div>

          {/* Campo de entrada */}
          <div className="input-grupo">
            <label className="etiqueta">Instructor</label>
            <input
              type="email"
              className="campo-correo"
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>

        {/* Botón de compartir */}
        <div className="modal-footer">
          <button className="boton-verde" onClick={onClose}>Compartir</button>
        </div>
      </div>
    </div>
  );
}
