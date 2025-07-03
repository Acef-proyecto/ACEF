import React, { useState } from 'react';
import { compartirActa } from '../../services/compartirService'; // 👈 Asegúrate de tener esta ruta bien
import "../../styles/instructor/compartir.css";

export default function CompartirCorreo({ onClose, idActa }) {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleCompartir = async () => {
    if (!correo) {
      setMensaje('❌ Ingresa el correo del instructor.');
      return;
    }

    try {
      setEnviando(true);
      setMensaje('');
      const token = localStorage.getItem('token');

      await compartirActa(idActa, correo, token); // 👈 llamada corregida

      setMensaje('✅ Acta compartida exitosamente.');
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.mensaje || 'No se pudo compartir el acta.';
      setMensaje(`❌ Error: ${errorMsg}`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-body">
          <div className="instruccion-con-cierre">
            <p className="instruccion">
              <em>Ingrese el correo del instructor con quien desea compartir el acta:</em>
            </p>
            <button className="cerrar-modal" onClick={onClose}>✕</button>
          </div>

          <div className="input-grupo">
            <label className="etiqueta">Correo del instructor</label>
            <input
              type="email"
              className="campo-correo"
              placeholder="correo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          {mensaje && <p className="mensaje">{mensaje}</p>}
        </div>

        <div className="modal-footer">
          <button className="boton-verde" onClick={handleCompartir} disabled={enviando}>
            {enviando ? 'Compartiendo...' : 'Compartir'}
          </button>
        </div>
      </div>
    </div>
  );
}
