import React, { useState } from 'react';
import { compartirActa } from '../../services/compartirService';
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

  if (!idActa) {
    setMensaje('❌ ID del acta no disponible.');
    console.warn("⚠️ idActa no recibido en el componente:", idActa);
    return;
  }

  try {
    setEnviando(true);
    setMensaje('');
    const token = localStorage.getItem('token');

    console.log("📤 Enviando:", { id_acta: idActa, correo_destino: correo });
    await compartirActa({ id_acta: idActa, correo_destino: correo }, token);

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
